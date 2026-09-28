package com.crickapp.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "balls")
public class Ball {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Inning inning;

    private int overNumber; // e.g. 1
    private int ballNumber; // e.g. 1 to 6 (or more if extras)

    @ManyToOne
    private Player bowler;

    @ManyToOne
    private Player batsman;

    @ManyToOne
    private Player nonStriker;

    private int runsScored; // Runs off the bat
    private int extraRuns;  // Wides, no-balls, leg byes, byes
    
    private String extraType; // WIDE, NO_BALL, BYE, LEG_BYE, NONE

    private boolean isWicket;
    private String wicketType; // BOWLED, CAUGHT, RUN_OUT, LBW, STUMPED, NONE
    
    @ManyToOne
    private Player playerOut;
    
    @ManyToOne
    private Player fielder; // For catch or run out
}
