package com.crickapp.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @ManyToOne
    private Team team1;
    
    @ManyToOne
    private Team team2;

    private String status; // SCHEDULED, LIVE, COMPLETED
    
    private Integer totalOvers;

    @ManyToOne
    private Team tossWinner;
    
    private String tossDecision; // BAT, BOWL
    
    @OneToOne(cascade = CascadeType.ALL)
    private Inning firstInning;

    @OneToOne(cascade = CascadeType.ALL)
    private Inning secondInning;
}
