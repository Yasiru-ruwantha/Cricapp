package com.crickapp.backend.dto;

import com.crickapp.backend.model.PlayerRole;

public record PlayerResponse(
        Long id,
        String name,
        PlayerRole role,
        Integer age
) {}
