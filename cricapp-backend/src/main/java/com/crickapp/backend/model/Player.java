package com.crickapp.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlayerRole role;

    private Integer age;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "total_runs")
    @Builder.Default
    private Integer totalRuns = 0;

    @Column(name = "total_wickets")
    @Builder.Default
    private Integer totalWickets = 0;

    @Column(name = "matches")
    @Builder.Default
    private Integer matches = 0;
}
