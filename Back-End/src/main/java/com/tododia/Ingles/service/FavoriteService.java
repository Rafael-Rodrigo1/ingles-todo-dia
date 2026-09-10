package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.response.FavoriteResponse;
import com.tododia.Ingles.entity.Favorite;
import com.tododia.Ingles.entity.Lesson;
import com.tododia.Ingles.entity.User;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.FavoriteMapper;
import com.tododia.Ingles.repository.FavoriteRepository;
import com.tododia.Ingles.repository.LessonRepository;
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
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final FavoriteMapper mapper;

    public FavoriteResponse addFavorite(Long lessonId) {

        User user = getAuthenticatedUser();

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lição não encontrada."
                        ));

        if (favoriteRepository.existsByUserIdAndLessonId(
                user.getId(),
                lessonId
        )) {
            return mapper.toResponse(
                    favoriteRepository
                            .findByUserIdAndLessonId(
                                    user.getId(),
                                    lessonId
                            )
                            .orElseThrow()
            );
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .lesson(lesson)
                .build();

        Favorite saved = favoriteRepository.save(favorite);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> findMyFavorites() {

        User user = getAuthenticatedUser();

        return mapper.toResponseList(
                favoriteRepository.findByUserId(user.getId())
        );
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long lessonId) {

        User user = getAuthenticatedUser();

        return favoriteRepository.existsByUserIdAndLessonId(
                user.getId(),
                lessonId
        );
    }

    public void removeFavorite(Long lessonId) {

        User user = getAuthenticatedUser();

        Favorite favorite = favoriteRepository
                .findByUserIdAndLessonId(
                        user.getId(),
                        lessonId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Favorito não encontrado."
                        ));

        favoriteRepository.delete(favorite);
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
                        ));
    }
}