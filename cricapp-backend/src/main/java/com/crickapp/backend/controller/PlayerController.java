package com.crickapp.backend.controller;

import com.crickapp.backend.dto.CreatePlayerRequest;
import com.crickapp.backend.dto.PlayerResponse;
import com.crickapp.backend.exception.ResourceNotFoundException;
import com.crickapp.backend.model.Player;
import com.crickapp.backend.model.PlayerRole;
import com.crickapp.backend.model.Team;
import com.crickapp.backend.repository.PlayerRepository;
import com.crickapp.backend.repository.TeamRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@Tag(name = "Player Management", description = "Endpoints to search, fetch, and create players")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    public PlayerController(PlayerRepository playerRepository, TeamRepository teamRepository) {
        this.playerRepository = playerRepository;
        this.teamRepository = teamRepository;
    }

    @GetMapping
    @Operation(summary = "Search players with filter for unassigned players")
    public ResponseEntity<List<PlayerResponse>> getPlayers(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "unassigned", required = false, defaultValue = "false") boolean unassigned
    ) {
        List<Player> players;
        boolean hasSearch = StringUtils.hasText(search);

        if (unassigned) {
            if (hasSearch) {
                players = playerRepository.findByTeamIsNullAndNameContainingIgnoreCaseOrderByNameAsc(search.trim());
            } else {
                players = playerRepository.findByTeamIsNullOrderByNameAsc();
            }
        } else {
            if (hasSearch) {
                players = playerRepository.findByNameContainingIgnoreCaseOrderByNameAsc(search.trim());
            } else {
                players = playerRepository.findAllByOrderByNameAsc();
            }
        }

        List<PlayerResponse> response = players.stream()
                .map(p -> new PlayerResponse(p.getId(), p.getName(), p.getRole(), p.getAge()))
                .toList();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Create a new player and optionally assign to a team")
    public ResponseEntity<PlayerResponse> createPlayer(@Valid @RequestBody CreatePlayerRequest request) {
        Team team = null;
        if (request.teamId() != null) {
            team = teamRepository.findById(request.teamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.teamId()));
        }

        Player player = Player.builder()
                .name(request.name().trim())
                .role(request.role() != null ? request.role() : PlayerRole.ALL_ROUNDER)
                .age(request.age() != null ? request.age() : 25)
                .team(team)
                .totalRuns(0)
                .totalWickets(0)
                .matches(0)
                .build();

        Player saved = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new PlayerResponse(saved.getId(), saved.getName(), saved.getRole(), saved.getAge()));
    }
}

