package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.UserProgressRequest;
import com.tododia.Ingles.dto.response.UserProgressResponse;
import com.tododia.Ingles.entity.Lesson;
import com.tododia.Ingles.entity.User;
import com.tododia.Ingles.entity.UserProgress;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.UserProgressMapper;
import com.tododia.Ingles.repository.LessonRepository;
import com.tododia.Ingles.repository.UserProgressRepository;
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
public class UserProgressService {

    private final UserProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final UserProgressMapper mapper;

    public UserProgressResponse saveProgress(
            UserProgressRequest request) {

        User user = getAuthenticatedUser();

        Lesson lesson = lessonRepository
                .findById(request.getLessonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lição não encontrada."
                        ));

        UserProgress progress = progressRepository
                .findByUserIdAndLessonId(
                        user.getId(),
                        lesson.getId()
                )
                .orElseGet(() -> {

                    UserProgress newProgress =
                            mapper.toEntity(request);

                    newProgress.setUser(user);
                    newProgress.setLesson(lesson);

                    return newProgress;
                });

        progress.setCompleted(request.getCompleted());
        progress.setScore(request.getScore());
        progress.setPercentage(request.getPercentage());
        progress.setCurrentSection(request.getCurrentSection());
        progress.setExercisesCompleted(
                request.getExercisesCompleted()
        );
        progress.setTotalStudyTime(
                request.getTotalStudyTime()
        );

        progress.setLastAccess(LocalDateTime.now());

        UserProgress saved =
                progressRepository.save(progress);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserProgressResponse> findMyProgress() {

        User user = getAuthenticatedUser();

        return mapper.toResponseList(
                progressRepository.findByUserId(user.getId())
        );
    }

    @Transactional(readOnly = true)
    public UserProgressResponse findMyProgressByLesson(
            Long lessonId) {

        User user = getAuthenticatedUser();

        UserProgress progress = progressRepository
                .findByUserIdAndLessonId(
                        user.getId(),
                        lessonId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Progresso não encontrado para esta lição."
                        ));

        return mapper.toResponse(progress);
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