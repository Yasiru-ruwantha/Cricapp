package com.crickapp.backend.dto;

import lombok.Data;

@Data
public class BowlerStatsDTO {
    private Long playerId;
    private String playerName;
    private double overs;
    private int maidens; // We'll default to 0 for simplicity, or calculate if requested
    private int runsConceded;
    private int wickets;
    private double economyRate;
}
