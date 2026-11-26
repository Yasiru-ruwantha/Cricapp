package com.crickapp.backend.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.*;

@Component
public class SupabaseJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extractAuthorities(jwt);
        String principal = jwt.getClaimAsString("email");
        if (!StringUtils.hasText(principal)) {
            principal = jwt.getSubject();
        }
        return new JwtAuthenticationToken(jwt, authorities, principal);
    }

    @SuppressWarnings("unchecked")
    private Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // 1. Extract from app_metadata (secure Supabase metadata)
        Map<String, Object> appMetadata = jwt.getClaim("app_metadata");
        if (appMetadata != null) {
            extractRolesFromMap(appMetadata, authorities);
        }

        // 2. Extract from user_metadata (user profile metadata)
        Map<String, Object> userMetadata = jwt.getClaim("user_metadata");
        if (userMetadata != null) {
            extractRolesFromMap(userMetadata, authorities);
        }

        // 3. Fallback: check top-level "role" claim
        String topLevelRole = jwt.getClaimAsString("role");
        if (StringUtils.hasText(topLevelRole) && !"authenticated".equalsIgnoreCase(topLevelRole) && !"anon".equalsIgnoreCase(topLevelRole)) {
            authorities.add(toAuthority(topLevelRole));
        }

        // Ensure every valid Supabase user has ROLE_USER by default
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return authorities;
    }

    @SuppressWarnings("unchecked")
    private void extractRolesFromMap(Map<String, Object> map, Set<GrantedAuthority> authorities) {
        // Single "role"
        Object singleRole = map.get("role");
        if (singleRole instanceof String roleStr && StringUtils.hasText(roleStr)) {
            authorities.add(toAuthority(roleStr));
        }

        // List "roles"
        Object rolesObj = map.get("roles");
        if (rolesObj instanceof Collection<?> rolesList) {
            for (Object r : rolesList) {
                if (r != null && StringUtils.hasText(r.toString())) {
                    authorities.add(toAuthority(r.toString()));
                }
            }
        }
    }

    private SimpleGrantedAuthority toAuthority(String role) {
        String trimmed = role.trim();
        String formatted = trimmed.toUpperCase().startsWith("ROLE_")
                ? trimmed.toUpperCase()
                : "ROLE_" + trimmed.toUpperCase();
        return new SimpleGrantedAuthority(formatted);
    }
}

