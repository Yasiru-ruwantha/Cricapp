package com.crickapp.backend.controller;

import com.crickapp.backend.dto.BallRequestDTO;
import com.crickapp.backend.dto.MatchScorecardDTO;
import com.crickapp.backend.model.Match;
import com.crickapp.backend.repository.MatchRepository;
import com.crickapp.backend.service.ScoringEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class LiveScoreController {

    @Autowired
    private ScoringEngineService scoringEngineService;

    @Autowired
    private MatchRepository matchRepository;

    @GetMapping("/{id}/scorecard")
    public MatchScorecardDTO getScorecard(@PathVariable Long id) {
        Match match = matchRepository.findById(id).orElseThrow(() -> new RuntimeException("Match not found"));
        return scoringEngineService.generateScorecard(match);
    }

    @GetMapping("/{id}/full-scorecard")
    public com.crickapp.backend.dto.FullScorecardDTO getFullScorecard(@PathVariable Long id) {
        Match match = matchRepository.findById(id).orElseThrow(() -> new RuntimeException("Match not found"));
        return scoringEngineService.generateFullScorecard(match);
    }

    @PostMapping("/{id}/ball")
    public MatchScorecardDTO recordBall(@PathVariable Long id, @RequestBody BallRequestDTO request) {
        request.setMatchId(id);
        return scoringEngineService.recordBall(request);
    }

    @PostMapping
    public Match createMatch(@RequestBody Match matchRequest) {
        matchRequest.setStatus("LIVE");
        if (matchRequest.getFirstInning() == null) {
            com.crickapp.backend.model.Inning firstInning = new com.crickapp.backend.model.Inning();
            matchRequest.setFirstInning(firstInning);
        }
        return matchRepository.save(matchRequest);
    }
}
