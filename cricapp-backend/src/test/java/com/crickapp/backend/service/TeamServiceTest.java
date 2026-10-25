package com.crickapp.backend.service;

import com.crickapp.backend.dto.LeadershipRequest;
import com.crickapp.backend.dto.TeamRequest;
import com.crickapp.backend.dto.TeamResponse;
import com.crickapp.backend.exception.BusinessRuleException;
import com.crickapp.backend.exception.ResourceConflictException;
import com.crickapp.backend.model.Player;
import com.crickapp.backend.model.PlayerRole;
import com.crickapp.backend.model.Team;
import com.crickapp.backend.repository.PlayerRepository;
import com.crickapp.backend.repository.TeamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private PlayerRepository playerRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private TeamService teamService;

    private Team team1;
    private Player player1;
    private Player player2;

    @BeforeEach
    void setUp() {
        team1 = Team.builder()
                .id(1L)
                .name("Super Kings")
                .players(new ArrayList<>())
                .build();

        player1 = Player.builder()
                .id(10L)
                .name("Player One")
                .role(PlayerRole.BATSMAN)
                .age(28)
                .team(team1)
                .build();

        player2 = Player.builder()
                .id(20L)
                .name("Player Two")
                .role(PlayerRole.BOWLER)
                .age(25)
                .team(team1)
                .build();

        team1.getPlayers().add(player1);
        team1.getPlayers().add(player2);
    }

    @Test
    @DisplayName("1. Duplicate team name throws ResourceConflictException (409)")
    void createTeam_duplicateName_throwsResourceConflictException() {
        when(teamRepository.existsByNameIgnoreCase("Super Kings")).thenReturn(true);

        TeamRequest request = new TeamRequest("Super Kings");

        assertThrows(ResourceConflictException.class, () -> teamService.createTeam(request));
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    @DisplayName("2. Adding player already in a team throws ResourceConflictException (409)")
    void addPlayerToSquad_playerAlreadyInTeam_throwsResourceConflictException() {
        Team otherTeam = Team.builder().id(2L).name("Other Team").build();
        Player playerInOtherTeam = Player.builder().id(30L).name("Player Three").team(otherTeam).build();

        when(teamRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(team1));
        when(playerRepository.findById(30L)).thenReturn(Optional.of(playerInOtherTeam));

        assertThrows(ResourceConflictException.class, () -> teamService.addPlayerToSquad(1L, 30L));
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    @DisplayName("3. Captain not in squad throws BusinessRuleException (400)")
    void setLeadership_captainNotInSquad_throwsBusinessRuleException() {
        Player externalPlayer = Player.builder().id(99L).name("External Player").team(null).build();

        when(teamRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(team1));
        when(playerRepository.findById(99L)).thenReturn(Optional.of(externalPlayer));

        LeadershipRequest request = new LeadershipRequest(99L, null);

        assertThrows(BusinessRuleException.class, () -> teamService.setLeadership(1L, request));
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    @DisplayName("4. Captain equals vice-captain throws BusinessRuleException (400)")
    void setLeadership_captainEqualsViceCaptain_throwsBusinessRuleException() {
        when(teamRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(team1));

        LeadershipRequest request = new LeadershipRequest(10L, 10L);

        assertThrows(BusinessRuleException.class, () -> teamService.setLeadership(1L, request));
        verify(teamRepository, never()).save(any(Team.class));
    }

    @Test
    @DisplayName("5. Removing captain clears the captain role automatically")
    void removePlayerFromSquad_removingCaptain_clearsCaptainRoleAutomatically() {
        team1.setCaptain(player1);
        when(teamRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(team1));
        when(playerRepository.findById(10L)).thenReturn(Optional.of(player1));
        when(teamRepository.save(any(Team.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TeamResponse response = teamService.removePlayerFromSquad(1L, 10L);

        assertNull(team1.getCaptain());
        assertNull(response.captainId());
        assertNull(player1.getTeam());
        verify(playerRepository).save(player1);
        verify(teamRepository).save(team1);
    }
}
