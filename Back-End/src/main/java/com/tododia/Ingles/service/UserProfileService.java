package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.ChangePasswordRequest;
import com.tododia.Ingles.dto.request.UpdateUserProfileRequest;
import com.tododia.Ingles.dto.response.UserProfileResponse;
import com.tododia.Ingles.entity.User;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.UserProfileMapper;
import com.tododia.Ingles.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileMapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile() {

        User user = getAuthenticatedUser();

        return mapper.toResponse(user);
    }

    public UserProfileResponse updateMyProfile(
            UpdateUserProfileRequest request) {

        User user = getAuthenticatedUser();

        user.setName(request.getName());
        user.setProfileImage(request.getProfileImage());

        User updated = userRepository.save(user);

        return mapper.toResponse(updated);
    }

    public void changePassword(ChangePasswordRequest request) {

        User user = getAuthenticatedUser();

        boolean currentPasswordMatches =
                passwordEncoder.matches(
                        request.getCurrentPassword(),
                        user.getPassword()
                );

        if (!currentPasswordMatches) {
            throw new IllegalArgumentException(
                    "Senha atual incorreta."
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "A nova senha deve ser diferente da senha atual."
            );
        }

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );

        user.setPassword(encodedPassword);

        userRepository.save(user);
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(
                authentication.getPrincipal())) {

            throw new IllegalStateException(
                    "Usuário não autenticado."
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuário autenticado não encontrado."
                        ));
    }
}
