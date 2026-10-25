package com.crickapp.backend.dto;

import jakarta.validation.constraints.NotNull;

public record AddPlayerRequest(
        @NotNull(message = "Player ID is required")
        Long playerId
) {}
