package com.crickapp.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Temporary development-only authentication filter.
 * Active ONLY under the "dev" Spring profile.
 *
 * TODO: Replace this filter with the real JwtAuthenticationFilter from the authentication module
 * once teammate 1 completes Feature 1 (Auth).
 */
@Component
@Profile("dev")
public class DevRoleFilter extends OncePerRequestFilter {

    public static final String DEV_ROLE_HEADER = "X-Dev-Role";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String devRoleHeader = request.getHeader(DEV_ROLE_HEADER);

        if (StringUtils.hasText(devRoleHeader)) {
            List<SimpleGrantedAuthority> authorities = Arrays.stream(devRoleHeader.split(","))
                    .map(String::trim)
                    .filter(StringUtils::hasText)
                    .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase())
                    .map(SimpleGrantedAuthority::new)
                    .toList();

            if (!authorities.isEmpty()) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken("dev-user", null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
