package com.crickapp.backend.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class SupabaseJwtAuthenticationConverterTest {

    private SupabaseJwtAuthenticationConverter converter;

    @BeforeEach
    void setUp() {
        converter = new SupabaseJwtAuthenticationConverter();
    }

    private Jwt createJwt(Map<String, Object> claims) {
        Map<String, Object> headers = Map.of("alg", "RS256", "typ", "JWT");
        return new Jwt(
                "token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                headers,
                claims
        );
    }

    @Test
    @DisplayName("Should extract single role from app_metadata as ROLE_ADMIN")
    void testExtractRoleFromAppMetadata() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "user-uuid-123");
        claims.put("email", "admin@cricapp.com");
        claims.put("app_metadata", Map.of("role", "ADMIN"));

        Jwt jwt = createJwt(claims);
        AbstractAuthenticationToken auth = converter.convert(jwt);

        assertNotNull(auth);
        assertEquals("admin@cricapp.com", auth.getName());

        List<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        assertTrue(authorities.contains("ROLE_ADMIN"));
        assertTrue(authorities.contains("ROLE_USER"));
    }

    @Test
    @DisplayName("Should extract multiple roles from app_metadata")
    void testExtractMultipleRoles() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "user-uuid-456");
        claims.put("email", "scorer@cricapp.com");
        claims.put("app_metadata", Map.of("roles", List.of("ORGANIZER", "ADMIN")));

        Jwt jwt = createJwt(claims);
        AbstractAuthenticationToken auth = converter.convert(jwt);

        assertNotNull(auth);
        List<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        assertTrue(authorities.contains("ROLE_ORGANIZER"));
        assertTrue(authorities.contains("ROLE_ADMIN"));
        assertTrue(authorities.contains("ROLE_USER"));
    }

    @Test
    @DisplayName("Should extract role from user_metadata if app_metadata is absent")
    void testExtractRoleFromUserMetadata() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "user-uuid-789");
        claims.put("email", "user@cricapp.com");
        claims.put("user_metadata", Map.of("role", "ORGANIZER"));

        Jwt jwt = createJwt(claims);
        AbstractAuthenticationToken auth = converter.convert(jwt);

        assertNotNull(auth);
        List<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        assertTrue(authorities.contains("ROLE_ORGANIZER"));
        assertTrue(authorities.contains("ROLE_USER"));
    }

    @Test
    @DisplayName("Should fallback to subject when email is absent")
    void testFallbackToSubject() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", "user-uuid-fallback");

        Jwt jwt = createJwt(claims);
        AbstractAuthenticationToken auth = converter.convert(jwt);

        assertNotNull(auth);
        assertEquals("user-uuid-fallback", auth.getName());

        List<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        assertTrue(authorities.contains("ROLE_USER"));
    }
}

