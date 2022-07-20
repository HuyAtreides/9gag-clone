package com.huyphan.filters;

import com.huyphan.models.exceptions.AuthException;
import com.huyphan.services.UserService;
import com.huyphan.utils.JwtUtil;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filter inspects and extracts token from HTTP authorization header.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    /**
     * {@inheritDoc}
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String credential = request.getHeader(HttpHeaders.AUTHORIZATION);
            String token = parseCredential(credential);
            if (!jwtUtil.validateToken(token)) {
                throw new AuthException("Invalid Token");
            }

            String subject = jwtUtil.getTokenSubject(token);
            UserDetails user = userService.loadUserByUsername(subject);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user,
                    user.getPassword(), user.getAuthorities());
            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            filterChain.doFilter(request, response);
        } catch (Exception error) {
            filterChain.doFilter(request, response);
        }
    }

    /**
     * Get JWT token from credential.
     *
     * @param credential Credential contains JWT token
     */
    private String parseCredential(String credential) throws AuthException {
        try {
            if (credential == null) {
                throw new AuthException("Credential Is Missing.");
            }

            String authSchema = credential.split(" ")[0];
            String token = credential.split(" ")[1].strip();

            if (!authSchema.equals("Bearer")) {
                throw new AuthException("Invalid Authorization Scheme.");
            }

            return token;
        } catch (ArrayIndexOutOfBoundsException exception) {
            throw new AuthException("Invalid Token");
        }
    }

}