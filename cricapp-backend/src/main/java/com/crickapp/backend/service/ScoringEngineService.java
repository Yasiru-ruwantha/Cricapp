package com.crickapp.backend.service;

import com.crickapp.backend.dto.BallRequestDTO;
import com.crickapp.backend.dto.MatchScorecardDTO;
import com.crickapp.backend.model.Ball;
import com.crickapp.backend.model.Inning;
import com.crickapp.backend.model.Match;
import com.crickapp.backend.repository.BallRepository;
import com.crickapp.backend.repository.MatchRepository;
import com.crickapp.backend.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScoringEngineService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private BallRepository ballRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public MatchScorecardDTO recordBall(BallRequestDTO request) {
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        Inning currentInning = match.getFirstInning(); // Simplified: always updates first inning for demo

        // Create new ball
        Ball ball = new Ball();
        ball.setInning(currentInning);
        ball.setRunsScored(request.getRuns());
        ball.setExtraRuns(request.getExtras());
        ball.setExtraType(request.getExtraType());
        ball.setWicket(request.isWicket());
        
        if (request.getBowlerId() != null) ball.setBowler(playerRepository.findById(request.getBowlerId()).orElse(null));
        if (request.getStrikerId() != null) ball.setBatsman(playerRepository.findById(request.getStrikerId()).orElse(null));

        ballRepository.save(ball);

        // Update Inning stats
        currentInning.setTotalRuns(currentInning.getTotalRuns() + request.getRuns() + request.getExtras());
        if (request.isWicket()) {
            currentInning.setTotalWickets(currentInning.getTotalWickets() + 1);
        }
        
        // Simplified over calculation: +0.1 for every valid ball
        if (request.getExtras() == 0 || "BYE".equals(request.getExtraType()) || "LEG_BYE".equals(request.getExtraType())) {
            double overs = currentInning.getOversBowled();
            int balls = (int) Math.round((overs - Math.floor(overs)) * 10);
            if (balls == 5) {
                currentInning.setOversBowled(Math.floor(overs) + 1.0);
            } else {
                currentInning.setOversBowled(overs + 0.1);
            }
        }
        matchRepository.save(match);

        // Broadcast updated scorecard
        MatchScorecardDTO scorecard = generateScorecard(match);
        messagingTemplate.convertAndSend("/topic/match/" + match.getId(), scorecard);
        
        return scorecard;
    }

    public MatchScorecardDTO generateScorecard(Match match) {
        MatchScorecardDTO dto = new MatchScorecardDTO();
        dto.setMatchId(match.getId());
        dto.setMatchTitle(match.getTitle());
        dto.setMatchStatus(match.getStatus());
        
        Inning inning = match.getFirstInning();
        if (inning != null) {
            dto.setTotalRuns(inning.getTotalRuns());
            dto.setTotalWickets(inning.getTotalWickets());
            dto.setOversBowled(inning.getOversBowled());
            if (inning.getBattingTeam() != null) dto.setBattingTeamName(inning.getBattingTeam().getName());
        }
        
        // Fetch recent balls for timeline
        List<Ball> recentBalls = ballRepository.findByInningIdOrderByIdDesc(inning.getId());
        List<String> recentBallStrings = new ArrayList<>();
        for (int i = 0; i < Math.min(6, recentBalls.size()); i++) {
            Ball b = recentBalls.get(i);
            if (b.isWicket()) recentBallStrings.add("W");
            else if (b.getExtraRuns() > 0) recentBallStrings.add(b.getExtraRuns() + b.getExtraType());
            else recentBallStrings.add(String.valueOf(b.getRunsScored()));
        }
        dto.setRecentBalls(recentBallStrings);

        return dto;
    }

    public com.crickapp.backend.dto.FullScorecardDTO generateFullScorecard(Match match) {
        com.crickapp.backend.dto.FullScorecardDTO dto = new com.crickapp.backend.dto.FullScorecardDTO();
        dto.setMatchId(match.getId());
        dto.setMatchTitle(match.getTitle());
        dto.setMatchStatus(match.getStatus());

        Inning inning = match.getFirstInning();
        if (inning == null) return dto;

        dto.setTotalRuns(inning.getTotalRuns());
        dto.setTotalWickets(inning.getTotalWickets());
        dto.setOversBowled(inning.getOversBowled());
        if (inning.getBattingTeam() != null) dto.setBattingTeamName(inning.getBattingTeam().getName());
        if (inning.getBowlingTeam() != null) dto.setBowlingTeamName(inning.getBowlingTeam().getName());

        List<Ball> allBalls = ballRepository.findByInningIdOrderByIdDesc(inning.getId());
        
        java.util.Map<Long, com.crickapp.backend.dto.BatterStatsDTO> batterMap = new java.util.LinkedHashMap<>();
        java.util.Map<Long, com.crickapp.backend.dto.BowlerStatsDTO> bowlerMap = new java.util.LinkedHashMap<>();
        
        int totalExtras = 0;

        // Process from oldest to newest to keep chronological order if needed, but since we just aggregate, any order works.
        for (Ball ball : allBalls) {
            totalExtras += ball.getExtraRuns();

            // Batting Stats
            if (ball.getBatsman() != null) {
                Long batterId = ball.getBatsman().getId();
                com.crickapp.backend.dto.BatterStatsDTO batter = batterMap.computeIfAbsent(batterId, id -> {
                    com.crickapp.backend.dto.BatterStatsDTO b = new com.crickapp.backend.dto.BatterStatsDTO();
                    b.setPlayerId(id);
                    b.setPlayerName(ball.getBatsman().getName());
                    b.setRuns(0);
                    b.setBallsFaced(0);
                    b.setFours(0);
                    b.setSixes(0);
                    b.setOut(false);
                    return b;
                });

                if (ball.getExtraType() == null || (!ball.getExtraType().equals("WIDE") && !ball.getExtraType().equals("NO_BALL"))) {
                    batter.setBallsFaced(batter.getBallsFaced() + 1);
                }
                
                batter.setRuns(batter.getRuns() + ball.getRunsScored());
                if (ball.getRunsScored() == 4) batter.setFours(batter.getFours() + 1);
                if (ball.getRunsScored() == 6) batter.setSixes(batter.getSixes() + 1);
                
                if (ball.isWicket()) {
                    batter.setOut(true);
                    String howOut = ball.getWicketType() != null ? ball.getWicketType().toLowerCase().replace("_", " ") : "out";
                    String bowlerName = ball.getBowler() != null ? ball.getBowler().getName() : "unknown bowler";
                    batter.setDismissalInfo(howOut + " b " + bowlerName);
                }
                
                if (batter.getBallsFaced() > 0) {
                    batter.setStrikeRate(Math.round(((double) batter.getRuns() / batter.getBallsFaced()) * 10000.0) / 100.0);
                }
            }

            // Bowling Stats
            if (ball.getBowler() != null) {
                Long bowlerId = ball.getBowler().getId();
                com.crickapp.backend.dto.BowlerStatsDTO bowler = bowlerMap.computeIfAbsent(bowlerId, id -> {
                    com.crickapp.backend.dto.BowlerStatsDTO b = new com.crickapp.backend.dto.BowlerStatsDTO();
                    b.setPlayerId(id);
                    b.setPlayerName(ball.getBowler().getName());
                    b.setRunsConceded(0);
                    b.setWickets(0);
                    b.setOvers(0.0);
                    return b;
                });

                bowler.setRunsConceded(bowler.getRunsConceded() + ball.getRunsScored() + ball.getExtraRuns());
                
                // Exclude run outs from bowler's wickets typically, but for simplicity we count it unless specified
                if (ball.isWicket() && (ball.getWicketType() == null || !ball.getWicketType().equals("RUN_OUT"))) {
                    bowler.setWickets(bowler.getWickets() + 1);
                }

                // Increment legal deliveries
                if (ball.getExtraType() == null || (!ball.getExtraType().equals("WIDE") && !ball.getExtraType().equals("NO_BALL"))) {
                    double overs = bowler.getOvers();
                    int balls = (int) Math.round((overs - Math.floor(overs)) * 10);
                    if (balls == 5) {
                        bowler.setOvers(Math.floor(overs) + 1.0);
                    } else {
                        bowler.setOvers(overs + 0.1);
                    }
                }
                
                // Economy rate
                double totalOvers = Math.floor(bowler.getOvers()) + ((bowler.getOvers() - Math.floor(bowler.getOvers())) * 10 / 6.0);
                if (totalOvers > 0) {
                    bowler.setEconomyRate(Math.round((bowler.getRunsConceded() / totalOvers) * 100.0) / 100.0);
                }
            }
        }

        dto.setExtras(totalExtras);
        dto.setBatters(new ArrayList<>(batterMap.values()));
        dto.setBowlers(new ArrayList<>(bowlerMap.values()));

        return dto;
    }
}
