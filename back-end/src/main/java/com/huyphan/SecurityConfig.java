package com.huyphan;

import com.huyphan.filters.JwtFilter;
import com.huyphan.securityexceptionshandlers.AuthExceptionsHandler;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.url}")
    private String url;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private AuthExceptionsHandler authExceptionsHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable().cors();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests()
                .antMatchers("/socket")
                .permitAll()
                .antMatchers("/auth/**")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/post/**")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/comment/**")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/user/{id:[0-9]+}")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/user/all")
                .permitAll()// TODO: Use appropriate role
                .antMatchers(HttpMethod.GET, "/v3/api-docs")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/section")
                .permitAll()
                .anyRequest().authenticated();

        http.exceptionHandling().authenticationEntryPoint(authExceptionsHandler);

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of(url, "http://localhost:3000"));
        corsConfiguration.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "DELETE"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setMaxAge(1800L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }
}
