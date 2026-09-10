package com.tododia.Ingles.config;

import com.tododia.Ingles.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/api/auth/**"
                        ).permitAll()

                        // CATEGORIES
                        .requestMatchers(HttpMethod.GET, "/api/categories/**")
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        // LESSONS
                        .requestMatchers(HttpMethod.GET, "/api/lessons/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/lessons/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/lessons/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/lessons/**")
                        .hasRole("ADMIN")

                        // LESSON SECTIONS
                        .requestMatchers(HttpMethod.GET, "/api/lesson-sections/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/lesson-sections/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/lesson-sections/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/lesson-sections/**")
                        .hasRole("ADMIN")

                        // EXERCISES
                        .requestMatchers(HttpMethod.GET, "/api/exercises/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/exercises/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/exercises/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/exercises/**")
                        .hasRole("ADMIN")

                        // QUESTIONS
                        .requestMatchers(HttpMethod.GET, "/api/questions/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/questions/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/questions/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/questions/**")
                        .hasRole("ADMIN")

                        // ALTERNATIVES
                        .requestMatchers(HttpMethod.GET, "/api/alternatives/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/alternatives/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/alternatives/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/alternatives/**")
                        .hasRole("ADMIN")

                        // VOCABULARY CATEGORIES
                        .requestMatchers(HttpMethod.GET, "/api/vocabulary-categories/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/vocabulary-categories/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/vocabulary-categories/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/vocabulary-categories/**")
                        .hasRole("ADMIN")

                        // VOCABULARY WORDS
                        .requestMatchers(HttpMethod.GET, "/api/vocabulary-words/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/vocabulary-words/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/vocabulary-words/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/vocabulary-words/**")
                        .hasRole("ADMIN")

                        // USER PROGRESS
                        .requestMatchers("/api/progress/**")
                        .authenticated()

                        // STUDY SESSIONS
                        .requestMatchers("/api/study-sessions/**")
                        .authenticated()

                        // FAVORITES
                        .requestMatchers("/api/favorites/**")
                        .authenticated()

                        // USER PROFILE
                        .requestMatchers("/api/users/me/**")
                        .authenticated()

                        // TAGS
                        .requestMatchers(HttpMethod.GET, "/api/tags/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/tags/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/tags/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/tags/**")
                        .hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

}