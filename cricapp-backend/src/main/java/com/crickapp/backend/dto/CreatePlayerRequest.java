package com.crickapp.backend.dto;

import com.crickapp.backend.model.PlayerRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePlayerRequest(
        @NotBlank(message = "Player name is required")
        @Size(min = 2, max = 50, message = "Player name must be between 2 and 50 characters")
        String name,
        PlayerRole role,
        Integer age,
        Long teamId
) {
    public CreatePlayerRequest(String name, PlayerRole role, Integer age) {
        this(name, role, age, null);
    }
}
