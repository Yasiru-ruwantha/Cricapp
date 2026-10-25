package com.crickapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TeamRequest(
        @NotBlank(message = "Team name is required")
        @Size(min = 3, max = 40, message = "Team name must be between 3 and 40 characters")
        String name
) {}
