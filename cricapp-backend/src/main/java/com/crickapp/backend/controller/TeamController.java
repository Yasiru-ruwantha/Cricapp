package com.crickapp.backend.controller;

import com.crickapp.backend.dto.*;
import com.crickapp.backend.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@Tag(name = "Team Management", description = "Endpoints for managing cricket teams, rosters, and leadership")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    @Operation(summary = "List all teams or search by name")
    public ResponseEntity<List<TeamSummaryResponse>> getAllTeams(@RequestParam(value = "search", required = false) String search) {
        return ResponseEntity.ok(teamService.getAllTeams(search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full team details with players squad")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Create a new team")
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody TeamRequest request) {
        TeamResponse created = teamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Update team name")
    public ResponseEntity<TeamResponse> updateTeamName(@PathVariable Long id, @Valid @RequestBody TeamRequest request) {
        return ResponseEntity.ok(teamService.updateTeamName(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete team and unassign squad players")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Upload team logo (PNG, JPG/JPEG up to 2MB)")
    public ResponseEntity<TeamResponse> uploadLogo(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(teamService.uploadLogo(id, file));
    }

    @PostMapping("/{id}/players")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Add an unassigned player to the team squad")
    public ResponseEntity<TeamResponse> addPlayer(@PathVariable Long id, @Valid @RequestBody AddPlayerRequest request) {
        return ResponseEntity.ok(teamService.addPlayerToSquad(id, request.playerId()));
    }

    @DeleteMapping("/{id}/players/{playerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Remove a player from the team squad")
    public ResponseEntity<TeamResponse> removePlayer(@PathVariable Long id, @PathVariable Long playerId) {
        return ResponseEntity.ok(teamService.removePlayerFromSquad(id, playerId));
    }

    @PutMapping("/{id}/leadership")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Assign or clear captain and vice-captain")
    public ResponseEntity<TeamResponse> setLeadership(@PathVariable Long id, @RequestBody LeadershipRequest request) {
        return ResponseEntity.ok(teamService.setLeadership(id, request));
    }
}
