package com.crickapp.backend.dto;

import java.util.List;

public record TeamResponse(
        Long id,
        String name,
        String logoUrl,
        Long captainId,
        Long viceCaptainId,
        List<PlayerResponse> players,
        String createdBy
) {
    public TeamResponse(Long id, String name, String logoUrl, Long captainId, Long viceCaptainId, List<PlayerResponse> players) {
        this(id, name, logoUrl, captainId, viceCaptainId, players, null);
    }
}
