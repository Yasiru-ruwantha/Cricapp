package com.crickapp.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class FullScorecardDTO {
    private Long matchId;
    private String matchTitle;
    private String matchStatus;
    
    private String battingTeamName;
    private String bowlingTeamName;
    
    private int totalRuns;
    private int totalWickets;
    private double oversBowled;
    private int extras;
    
    private List<BatterStatsDTO> batters;
    private List<BowlerStatsDTO> bowlers;
}
