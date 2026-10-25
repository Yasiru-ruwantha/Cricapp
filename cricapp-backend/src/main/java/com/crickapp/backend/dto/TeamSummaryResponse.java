package com.crickapp.backend.dto;

public record TeamSummaryResponse(
        Long id,
        String name,
        String logoUrl,
        String captainName,
        int playerCount
) {}
