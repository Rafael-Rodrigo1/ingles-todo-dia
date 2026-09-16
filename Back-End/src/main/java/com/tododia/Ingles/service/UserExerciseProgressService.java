package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.UserExerciseProgressRequest;
import com.tododia.Ingles.dto.response.UserExerciseProgressResponse;
import com.tododia.Ingles.entity.Exercise;
import com.tododia.Ingles.entity.User;
import com.tododia.Ingles.entity.UserExerciseProgress;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.repository.ExerciseRepository;
import com.tododia.Ingles.repository.UserExerciseProgressRepository;
import com.tododia.Ingles.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserExerciseProgressService {

    private final UserExerciseProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;

    public UserExerciseProgressResponse saveProgress(
            UserExerciseProgressRequest request) {

        User user = getAuthenticatedUser();

        Exercise exercise = exerciseRepository
                .findById(request.getExerciseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exercício não encontrado."
                        ));

        UserExerciseProgress progress = progressRepository
                .findByUserIdAndExerciseId(
                        user.getId(),
                        exercise.getId()
                )
                .orElseGet(() ->
                        UserExerciseProgress.builder()
                                .user(user)
                                .exercise(exercise)
                                .build()
                );

        progress.setCompleted(request.getCompleted());
        progress.setScore(request.getScore());

        progress.setAttempts(
                progress.getAttempts() + 1
        );

        progress.setLastAttempt(LocalDateTime.now());

        UserExerciseProgress saved =
                progressRepository.save(progress);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserExerciseProgressResponse> findByLesson(
            Long lessonId) {

        User user = getAuthenticatedUser();

        return progressRepository
                .findByUserIdAndExerciseLessonId(
                        user.getId(),
                        lessonId
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserExerciseProgressResponse findByExercise(
            Long exerciseId) {

        User user = getAuthenticatedUser();

        UserExerciseProgress progress = progressRepository
                .findByUserIdAndExerciseId(
                        user.getId(),
                        exerciseId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Progresso não encontrado para este exercício."
                        ));

        return toResponse(progress);
    }

    private UserExerciseProgressResponse toResponse(
            UserExerciseProgress progress) {

        return UserExerciseProgressResponse.builder()
                .id(progress.getId())
                .exerciseId(progress.getExercise().getId())
                .completed(progress.getCompleted())
                .score(progress.getScore())
                .attempts(progress.getAttempts())
                .lastAttempt(progress.getLastAttempt())
                .build();
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
