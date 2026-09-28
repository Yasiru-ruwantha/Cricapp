package com.crickapp.backend.dto;

import lombok.Data;

@Data
public class BallRequestDTO {
    private Long matchId;
    private Long bowlerId;
    private Long strikerId;
    private Long nonStrikerId;
    private int runs;
    private int extras;
    private String extraType;
    private boolean isWicket;
    private String wicketType;
    private Long playerOutId;
    private Long fielderId;
}
