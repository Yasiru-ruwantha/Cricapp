package com.crickapp.backend.controller;

import com.crickapp.backend.dto.PlayerResponse;
import com.crickapp.backend.model.Player;
import com.crickapp.backend.repository.PlayerRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@Tag(name = "Player Management (Minimal)", description = "Minimal endpoint to search and fetch unassigned players")
public class PlayerController {

    private final PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
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
}
