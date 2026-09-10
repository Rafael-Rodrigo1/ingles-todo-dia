package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.auth.LoginRequest;
import com.tododia.Ingles.dto.auth.LoginResponse;
import com.tododia.Ingles.dto.auth.RegisterRequest;
import com.tododia.Ingles.entity.Role;
import com.tododia.Ingles.entity.User;
import com.tododia.Ingles.enums.RoleName;
import com.tododia.Ingles.security.CustomUserDetails;
import com.tododia.Ingles.exception.DuplicateResourceException;
import com.tododia.Ingles.repository.RoleRepository;
import com.tododia.Ingles.repository.UserRepository;
import com.tododia.Ingles.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("E-mail já cadastrado.");
        }

        Role role = roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new RuntimeException("Role USER não encontrada."));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .enabled(true)
                .build();

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(
                new CustomUserDetails(user)
        );

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().getName().name())
                .build();
    }
}