package com.crickapp.backend.service;

import com.crickapp.backend.dto.*;
import com.crickapp.backend.exception.BusinessRuleException;
import com.crickapp.backend.exception.ResourceConflictException;
import com.crickapp.backend.exception.ResourceNotFoundException;
import com.crickapp.backend.model.Player;
import com.crickapp.backend.model.Team;
import com.crickapp.backend.repository.PlayerRepository;
import com.crickapp.backend.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final FileStorageService fileStorageService;

    public TeamService(TeamRepository teamRepository,
                       PlayerRepository playerRepository,
                       FileStorageService fileStorageService) {
        this.teamRepository = teamRepository;
        this.playerRepository = playerRepository;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Retrieves summary list of teams with optional case-insensitive name search.
     *
     * @param search optional search query to filter by team name
     * @return list of TeamSummaryResponse
     */
    @Transactional(readOnly = true)
    public List<TeamSummaryResponse> getAllTeams(String search) {
        List<Team> teams;
        if (StringUtils.hasText(search)) {
            teams = teamRepository.findByNameContainingIgnoreCaseOrderByNameAsc(search.trim());
        } else {
            teams = teamRepository.findAllByOrderByNameAsc();
        }

        return teams.stream()
                .map(t -> new TeamSummaryResponse(
                        t.getId(),
                        t.getName(),
                        t.getLogoUrl(),
                        t.getCaptain() != null ? t.getCaptain().getName() : null,
                        t.getPlayers() != null ? t.getPlayers().size() : 0
                ))
                .toList();
    }

    /**
     * Retrieves full team details including squad players.
     *
     * @param id team ID
     * @return full TeamResponse
     * @throws ResourceNotFoundException if team does not exist
     */
    @Transactional(readOnly = true)
    public TeamResponse getTeamById(Long id) {
        Team team = teamRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
        return mapToTeamResponse(team);
    }

    /**
     * Creates a new team with unique case-insensitive name validation.
     *
     * @param request creation request containing team name
     * @return created TeamResponse
     * @throws ResourceConflictException if team name already exists
     */
    @Transactional
    public TeamResponse createTeam(TeamRequest request) {
        String trimmedName = request.name().trim();
        if (teamRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new ResourceConflictException("Team with name '" + trimmedName + "' already exists");
        }

        Team team = Team.builder()
                .name(trimmedName)
                .players(new ArrayList<>())
                .build();

        Team saved = teamRepository.save(team);
        return mapToTeamResponse(saved);
    }

    /**
     * Updates team name with unique case-insensitive name check excluding current team.
     *
     * @param id team ID
     * @param request update request containing new team name
     * @return updated TeamResponse
     * @throws ResourceNotFoundException if team does not exist
     * @throws ResourceConflictException if new name belongs to another team
     */
    @Transactional
    public TeamResponse updateTeamName(Long id, TeamRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));

        String trimmedName = request.name().trim();
        if (teamRepository.existsByNameIgnoreCaseAndIdNot(trimmedName, id)) {
            throw new ResourceConflictException("Team with name '" + trimmedName + "' already exists");
        }

        team.setName(trimmedName);
        Team saved = teamRepository.save(team);
        return mapToTeamResponse(saved);
    }

    /**
     * Deletes a team: clears leadership, unassigns all squad players (team = null),
     * removes the logo file from storage, and deletes the team entity.
     *
     * @param id team ID
     * @throws ResourceNotFoundException if team does not exist
     */
    @Transactional
    public void deleteTeam(Long id) {
        Team team = teamRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));

        if (StringUtils.hasText(team.getLogoUrl())) {
            fileStorageService.deleteLogo(team.getLogoUrl());
        }

        team.setCaptain(null);
        team.setViceCaptain(null);

        if (team.getPlayers() != null) {
            for (Player player : team.getPlayers()) {
                player.setTeam(null);
                playerRepository.save(player);
            }
            team.getPlayers().clear();
        }

        teamRepository.delete(team);
    }

    /**
     * Uploads and sets a new logo for the team, deleting the previous logo file if present.
     *
     * @param id team ID
     * @param file multipart image file (PNG/JPG, max 2MB)
     * @return updated TeamResponse
     * @throws ResourceNotFoundException if team does not exist
     */
    @Transactional
    public TeamResponse uploadLogo(Long id, MultipartFile file) {
        Team team = teamRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));

        String oldLogoUrl = team.getLogoUrl();
        String newLogoUrl = fileStorageService.storeLogo(file);

        team.setLogoUrl(newLogoUrl);
        Team saved = teamRepository.save(team);

        if (StringUtils.hasText(oldLogoUrl)) {
            fileStorageService.deleteLogo(oldLogoUrl);
        }

        return mapToTeamResponse(saved);
    }

    /**
     * Adds an unassigned player to a team's squad.
     * Enforces the rule that a player can only belong to one team.
     *
     * @param teamId team ID
     * @param playerId player ID to add
     * @return updated TeamResponse
     * @throws ResourceNotFoundException if team or player does not exist
     * @throws ResourceConflictException if player already belongs to a team
     */
    @Transactional
    public TeamResponse addPlayerToSquad(Long teamId, Long playerId) {
        Team team = teamRepository.findByIdWithDetails(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));

        if (player.getTeam() != null) {
            if (player.getTeam().getId().equals(teamId)) {
                throw new ResourceConflictException("Player is already in this team's squad");
            } else {
                throw new ResourceConflictException("Player already belongs to team: " + player.getTeam().getName());
            }
        }

        player.setTeam(team);
        playerRepository.save(player);

        if (team.getPlayers() == null) {
            team.setPlayers(new ArrayList<>());
        }
        team.getPlayers().add(player);

        Team saved = teamRepository.save(team);
        return mapToTeamResponse(saved);
    }

    /**
     * Removes a player from the team squad.
     * Automatically clears captain or vice-captain status if the removed player held it.
     *
     * @param teamId team ID
     * @param playerId player ID to remove
     * @return updated TeamResponse
     * @throws ResourceNotFoundException if team or player does not exist
     * @throws BusinessRuleException if player is not in the team squad
     */
    @Transactional
    public TeamResponse removePlayerFromSquad(Long teamId, Long playerId) {
        Team team = teamRepository.findByIdWithDetails(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id: " + playerId));

        if (player.getTeam() == null || !player.getTeam().getId().equals(teamId)) {
            throw new BusinessRuleException("Player is not in this team's squad");
        }

        // Rule 5: Automatically clear leadership if player was captain or vice-captain
        if (team.getCaptain() != null && Objects.equals(team.getCaptain().getId(), playerId)) {
            team.setCaptain(null);
        }
        if (team.getViceCaptain() != null && Objects.equals(team.getViceCaptain().getId(), playerId)) {
            team.setViceCaptain(null);
        }

        player.setTeam(null);
        playerRepository.save(player);

        if (team.getPlayers() != null) {
            team.getPlayers().removeIf(p -> Objects.equals(p.getId(), playerId));
        }

        Team saved = teamRepository.save(team);
        return mapToTeamResponse(saved);
    }

    /**
     * Sets or clears captain and vice-captain for a team.
     * Enforces rules:
     * 1. Captain and vice-captain cannot be the same player.
     * 2. Captain and vice-captain must both be members of this team's squad.
     *
     * @param teamId team ID
     * @param request leadership request containing captainId and viceCaptainId
     * @return updated TeamResponse
     * @throws ResourceNotFoundException if team or designated players do not exist
     * @throws BusinessRuleException if leadership rules are violated
     */
    @Transactional
    public TeamResponse setLeadership(Long teamId, LeadershipRequest request) {
        Team team = teamRepository.findByIdWithDetails(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        Long captainId = request.captainId();
        Long viceCaptainId = request.viceCaptainId();

        // Rule 4: Captain and vice-captain cannot be the same player
        if (captainId != null && viceCaptainId != null && Objects.equals(captainId, viceCaptainId)) {
            throw new BusinessRuleException("Captain and vice-captain cannot be the same player");
        }

        Player captain = null;
        if (captainId != null) {
            Player p = playerRepository.findById(captainId)
                    .orElseThrow(() -> new ResourceNotFoundException("Captain player not found with id: " + captainId));
            // Rule 3: Must belong to this team's squad
            if (p.getTeam() == null || !Objects.equals(p.getTeam().getId(), teamId)) {
                throw new BusinessRuleException("Captain must belong to this team's squad");
            }
            captain = p;
        }

        Player viceCaptain = null;
        if (viceCaptainId != null) {
            Player p = playerRepository.findById(viceCaptainId)
                    .orElseThrow(() -> new ResourceNotFoundException("Vice-captain player not found with id: " + viceCaptainId));
            // Rule 3: Must belong to this team's squad
            if (p.getTeam() == null || !Objects.equals(p.getTeam().getId(), teamId)) {
                throw new BusinessRuleException("Vice-captain must belong to this team's squad");
            }
            viceCaptain = p;
        }

        team.setCaptain(captain);
        team.setViceCaptain(viceCaptain);

        Team saved = teamRepository.save(team);
        return mapToTeamResponse(saved);
    }

    /**
     * Maps Team entity to TeamResponse DTO to avoid cyclic references and lazy loading issues.
     */
    public TeamResponse mapToTeamResponse(Team team) {
        List<PlayerResponse> playerResponses = (team.getPlayers() != null)
                ? team.getPlayers().stream()
                .map(p -> new PlayerResponse(p.getId(), p.getName(), p.getRole(), p.getAge()))
                .toList()
                : List.of();

        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getLogoUrl(),
                team.getCaptain() != null ? team.getCaptain().getId() : null,
                team.getViceCaptain() != null ? team.getViceCaptain().getId() : null,
                playerResponses
        );
    }
}
