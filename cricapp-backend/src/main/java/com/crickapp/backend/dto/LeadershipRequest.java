package com.crickapp.backend.dto;

public record LeadershipRequest(
        Long captainId,
        Long viceCaptainId
) {}
