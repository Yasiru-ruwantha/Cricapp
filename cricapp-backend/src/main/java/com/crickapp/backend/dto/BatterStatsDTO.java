package com.crickapp.backend.dto;

import lombok.Data;

@Data
public class BatterStatsDTO {
    private Long playerId;
    private String playerName;
    private int runs;
    private int ballsFaced;
    private int fours;
    private int sixes;
    private double strikeRate;
    private boolean isOut;
    private String dismissalInfo; // e.g. "c Kohli b Bumrah" or "b Bumrah"
}
