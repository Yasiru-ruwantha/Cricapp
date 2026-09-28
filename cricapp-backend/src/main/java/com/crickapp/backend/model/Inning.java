package com.crickapp.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
@Table(name = "innings")
public class Inning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Team battingTeam;

    @ManyToOne
    private Team bowlingTeam;

    private int totalRuns = 0;
    private int totalWickets = 0;
    
    // Stored as 5.2 (5 overs, 2 balls)
    private double oversBowled = 0.0;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "inning_id")
    private List<Ball> balls;
}
