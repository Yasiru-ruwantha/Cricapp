package com.crickapp.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtDecoderConfig {

    /**
     * If SUPABASE_JWT_SECRET is specified in environment or .env, decode JWT using HMAC-SHA256.
     * Otherwise, Spring Boot automatically decodes via the jwk-set-uri configured in application.yml.
     */
    @Bean
    @ConditionalOnExpression("!'${supabase.jwt.secret:}'.trim().isEmpty()")
    public JwtDecoder jwtDecoderBySecret(@Value("${supabase.jwt.secret}") String secret) {
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key).build();
    }
}

