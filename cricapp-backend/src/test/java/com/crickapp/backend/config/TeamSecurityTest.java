package com.crickapp.backend.config;

import com.crickapp.backend.model.Team;
import com.crickapp.backend.repository.TeamRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.lang.reflect.Proxy;
import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class TeamSecurityTest {

    private TeamSecurity teamSecurity;
    private Map<Long, Team> teams;

    @BeforeEach
    void setUp() {
        teams = new HashMap<>();

        Team team = Team.builder()
                .id(1L)
                .name("Super Kings")
                .createdBy("creator-uuid-123")
                .build();
        teams.put(1L, team);

        Team legacyTeam = Team.builder()
                .id(2L)
                .name("Legacy Team")
                .createdBy(null)
                .build();
        teams.put(2L, legacyTeam);

        TeamRepository fakeRepo = (TeamRepository) Proxy.newProxyInstance(
                TeamRepository.class.getClassLoader(),
                new Class<?>[]{TeamRepository.class},
                (proxy, method, args) -> {
                    if ("findById".equals(method.getName()) && args != null && args.length == 1) {
                        return Optional.ofNullable(teams.get((Long) args[0]));
                    }
                    return null;
                }
        );

        teamSecurity = new TeamSecurity(fakeRepo);
    }

    @Test
    @DisplayName("Admin can manage any team even if not creator")
    void admin_canManageAnyTeam() {
        UsernamePasswordAuthenticationToken adminAuth = new UsernamePasswordAuthenticationToken(
                "admin-user",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        assertTrue(teamSecurity.isOwnerOrAdmin(1L, adminAuth));
    }

    @Test
    @DisplayName("Creator can manage their own team (matching UUID)")
    void creator_canManageOwnTeam() {
        Jwt jwt = new Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "none"),
                Map.of("sub", "creator-uuid-123", "email", "creator@example.com")
        );
        JwtAuthenticationToken creatorAuth = new JwtAuthenticationToken(
                jwt,
                List.of(new SimpleGrantedAuthority("ROLE_ORGANIZER")),
                "creator@example.com"
        );

        assertTrue(teamSecurity.isOwnerOrAdmin(1L, creatorAuth));
    }

    @Test
    @DisplayName("Other organizer CANNOT manage someone else's team")
    void otherOrganizer_cannotManageSomeoneElsesTeam() {
        Jwt jwt = new Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "none"),
                Map.of("sub", "other-user-uuid-999", "email", "other@example.com")
        );
        JwtAuthenticationToken otherAuth = new JwtAuthenticationToken(
                jwt,
                List.of(new SimpleGrantedAuthority("ROLE_ORGANIZER")),
                "other@example.com"
        );

        assertFalse(teamSecurity.isOwnerOrAdmin(1L, otherAuth));
    }

    @Test
    @DisplayName("Legacy team without createdBy allows any organizer")
    void legacyTeam_withoutCreatedBy_allowsOrganizer() {
        UsernamePasswordAuthenticationToken organizerAuth = new UsernamePasswordAuthenticationToken(
                "organizer-user",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ORGANIZER"))
        );

        assertTrue(teamSecurity.isOwnerOrAdmin(2L, organizerAuth));
    }

    @Test
    @DisplayName("Unauthenticated request returns false")
    void unauthenticated_returnsFalse() {
        assertFalse(teamSecurity.isOwnerOrAdmin(1L, null));
    }
}
