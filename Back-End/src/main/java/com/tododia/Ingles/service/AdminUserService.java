package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.UpdateUserEnabledRequest;
import com.tododia.Ingles.dto.request.UpdateUserRoleRequest;
import com.tododia.Ingles.dto.response.AdminUserResponse;
import com.tododia.Ingles.entity.Role;
import com.tododia.Ingles.entity.User;
import com.tododia.Ingles.enums.RoleName;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.repository.RoleRepository;
import com.tododia.Ingles.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> findAll() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminUserResponse findById(Long id) {

        User user = findUser(id);

        return toResponse(user);
    }

    public AdminUserResponse updateEnabled(
            Long id,
            UpdateUserEnabledRequest request
    ) {

        User user = findUser(id);
        User authenticatedUser = getAuthenticatedUser();

        if (user.getId().equals(authenticatedUser.getId())
                && Boolean.FALSE.equals(request.getEnabled())) {

            throw new IllegalArgumentException(
                    "Você não pode desativar sua própria conta."
            );
        }

        user.setEnabled(request.getEnabled());

        User updated = userRepository.save(user);

        return toResponse(updated);
    }

    public AdminUserResponse updateRole(
            Long id,
            UpdateUserRoleRequest request
    ) {

        User user = findUser(id);
        User authenticatedUser = getAuthenticatedUser();

        if (user.getId().equals(authenticatedUser.getId())
                && request.getRole() != RoleName.ADMIN) {

            throw new IllegalArgumentException(
                    "Você não pode remover seu próprio acesso de administrador."
            );
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Perfil de acesso não encontrado."
                        )
                );

        user.setRole(role);

        User updated = userRepository.save(user);

        return toResponse(updated);
    }

    private User findUser(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuário não encontrado."
                        )
                );
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new IllegalStateException(
                    "Usuário não autenticado."
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuário autenticado não encontrado."
                        )
                );
    }

    private AdminUserResponse toResponse(User user) {

        return AdminUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .emailVerified(user.getEmailVerified())
                .profileImage(user.getProfileImage())
                .lastLogin(user.getLastLogin())
                .role(user.getRole().getName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}