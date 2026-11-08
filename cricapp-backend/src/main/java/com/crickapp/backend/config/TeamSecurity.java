package com.crickapp.backend.config;

import com.crickapp.backend.model.Team;
import com.crickapp.backend.repository.TeamRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Objects;

@Component("teamSecurity")
public class TeamSecurity {

    private final TeamRepository teamRepository;

    public TeamSecurity(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    /**
     * Checks if the currently authenticated user is authorized to edit the team
     * and its squad members.
     *
     * Rules:
     * 1. System ADMIN has full permission to edit any team and its members.
     * 2. The user who created the team (createdBy) can edit their team and team members.
     * 3. Other users (even with ORGANIZER role) cannot edit someone else's team.
     * 4. For legacy/seeded teams without a recorded creator, any ADMIN or ORGANIZER can edit.
     *
     * @param teamId the ID of the team being modified
     * @param authentication the current Spring Security authentication
     * @return true if permitted, false otherwise (results in 403 Forbidden)
     */
    public boolean isOwnerOrAdmin(Long teamId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // 1. System ADMIN can manage any team
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (isAdmin) {
            return true;
        }

        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            // Let the controller proceed so it throws standard ResourceNotFoundException (404)
            return true;
        }

        // 2. Legacy / seeded teams without createdBy: allow any ORGANIZER or ADMIN
        if (!StringUtils.hasText(team.getCreatedBy())) {
            return authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_ORGANIZER".equals(a.getAuthority()) || "ROLE_ADMIN".equals(a.getAuthority()));
        }

        // 3. Only the user who created the team is permitted
        return matchesUser(team.getCreatedBy(), authentication);
    }

    public static boolean matchesUser(String createdBy, Authentication authentication) {
        if (!StringUtils.hasText(createdBy) || authentication == null) {
            return false;
        }

        // Check authentication.getName() (usually email or dev-user)
        if (Objects.equals(createdBy, authentication.getName())) {
            return true;
        }

        // Check Supabase JWT subject (UUID) and email claims
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            String sub = jwtAuth.getToken().getSubject();
            if (StringUtils.hasText(sub) && Objects.equals(createdBy, sub)) {
                return true;
            }
            String email = jwtAuth.getToken().getClaimAsString("email");
            if (StringUtils.hasText(email) && Objects.equals(createdBy, email)) {
                return true;
            }
        }

        return false;
    }
}

