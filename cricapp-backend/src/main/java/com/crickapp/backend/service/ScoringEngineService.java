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
}
