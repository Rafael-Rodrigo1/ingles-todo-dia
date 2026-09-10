package com.tododia.Ingles.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("\n========== JWT FILTER ==========");
        System.out.println("URI: " + request.getRequestURI());
        System.out.println("Authorization existe: " + (authHeader != null));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("SEM TOKEN BEARER");
            System.out.println("================================\n");

            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = authHeader.substring(7).trim();

            String username = jwtService.extractUsername(jwt);

            System.out.println("JWT USER: " + username);

            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                System.out.println("USER DETAILS: " + userDetails.getUsername());
                System.out.println("JWT AUTHORITIES: " + userDetails.getAuthorities());

                boolean valid = jwtService.isTokenValid(jwt, userDetails);

                System.out.println("TOKEN VÁLIDO: " + valid);

                if (valid) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    System.out.println(
                            "AUTH FINAL: " +
                                    SecurityContextHolder.getContext()
                                            .getAuthentication()
                                            .getAuthorities()
                    );
                }
            }

            System.out.println("================================\n");

        } catch (JwtException | IllegalArgumentException exception) {

            System.out.println("ERRO JWT: " + exception.getMessage());

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            response.getWriter().write(
                    """
                    {
                      "status": 401,
                      "error": "Unauthorized",
                      "message": "Token JWT inválido ou malformado."
                    }
                    """
            );

            return;
        }

        filterChain.doFilter(request, response);
    }
}