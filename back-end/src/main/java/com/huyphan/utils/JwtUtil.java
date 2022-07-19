package com.huyphan.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Calendar;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/**
 * Provides methods for working with JSON Web Token.
 */
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class JwtUtil {

    /**
     * JWT secret key.
     */
    @Value("${app.jwt-secret}")
    private String secret;

    /**
     * JWT expiration date.
     */
    @Value("${app.jwt-expiration-days}")
    private int expirationDays;

    /**
     * Create signing key from secret key string.
     */
    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generate JWT
     *
     * @param user User info.
     */
    public String generateToken(UserDetails user) {
        String username = user.getUsername();
        Calendar calendar = Calendar.getInstance();
        Date issueDate = new Date();
        calendar.setTime(issueDate);
        calendar.add(Calendar.DATE, expirationDays);
        Date expiredDate = calendar.getTime();
        Key key = getSigningKey();
        return Jwts.builder().setSubject(username).setIssuedAt(issueDate).setExpiration(expiredDate)
                .signWith(key).compact();
    }

    /**
     * Validate token.
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException jwtException) {
            return false;
        }
    }

    /**
     * Get subject from token.
     */
    public String getTokenSubject(String token) {
        Claims claims = parseToken(token);
        return claims.getSubject();
    }

    /**
     * Parse token.
     *
     * @param token Token to parse.
     */
    private Claims parseToken(String token) {
        Key signingKey = getSigningKey();
        return Jwts.parserBuilder().setSigningKey(signingKey).build().parseClaimsJws(token)
                .getBody();
    }

    /**
     * Parse expired token. Accept expired jwt exception.
     *
     * @param token Token to parse.
     */
    public Claims parseExpiredToken(String token) {
        try {
            return parseToken(token);
        } catch (ExpiredJwtException jwtException) {
            return jwtException.getClaims();
        }
    }
}
