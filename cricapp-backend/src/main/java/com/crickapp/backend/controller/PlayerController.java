package com.crickapp.backend.controller;

import com.crickapp.backend.model.Player;
import com.crickapp.backend.model.Team;
import com.crickapp.backend.repository.PlayerRepository;
import com.crickapp.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping("/players")
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @PostMapping("/players")
    public Player createPlayer(@RequestBody Player player) {
        return playerRepository.save(player);
    }

    @PostMapping("/teams/{teamId}/players")
    public Player addPlayerToTeam(@PathVariable Long teamId, @RequestBody Player playerRequest) {
        // If the player already has an ID, they exist in the DB. Otherwise, it's a new player.
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        team.getPlayers().add(playerRequest);
        teamRepository.save(team);
        
        return team.getPlayers().get(team.getPlayers().size() - 1);
    }

    @PutMapping("/teams/{teamId}/players/{playerId}")
    public Player assignExistingPlayerToTeam(@PathVariable Long teamId, @PathVariable Long playerId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        
        team.getPlayers().add(player);
        teamRepository.save(team);
        
        return player;
    }
}
