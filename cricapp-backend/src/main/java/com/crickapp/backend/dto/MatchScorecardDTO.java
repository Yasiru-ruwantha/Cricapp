package com.crickapp.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class MatchScorecardDTO {
    private Long matchId;
    private String matchTitle;
    private String matchStatus;
    
    private String battingTeamName;
    private String bowlingTeamName;
    
    private int totalRuns;
    private int totalWickets;
    private double oversBowled;
    
    private String strikerName;
    private int strikerRuns;
    private int strikerBalls;
    
    private String nonStrikerName;
    private int nonStrikerRuns;
    private int nonStrikerBalls;
    
    private String bowlerName;
    private double bowlerOvers;
    private int bowlerRuns;
    private int bowlerWickets;
    
    // E.g. "W", "1", "4", "6", "wd", "nb"
    private List<String> recentBalls; 
}
