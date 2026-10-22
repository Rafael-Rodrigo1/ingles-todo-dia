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
import com.tododia.Ingles.entity.Exercise;
import com.tododia.Ingles.entity.UserExerciseProgress;
import com.tododia.Ingles.repository.ExerciseRepository;
import com.tododia.Ingles.repository.UserExerciseProgressRepository;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
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
    private final ExerciseRepository exerciseRepository;
    private final UserExerciseProgressRepository exerciseProgressRepository;


    public UserProgressResponse saveProgress(
            UserProgressRequest request) {

        User user = getAuthenticatedUser();

        Lesson lesson = lessonRepository
                .findById(request.getLessonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lição não encontrada."
                        ));

        List<Exercise> activeExercises = exerciseRepository
                .findByLessonId(lesson.getId())
                .stream()
                .filter(exercise ->
                        Boolean.TRUE.equals(exercise.getActive()))
                .toList();

        Map<Long, UserExerciseProgress> progressByExercise =
                exerciseProgressRepository
                        .findByUserIdAndExerciseLessonId(
                                user.getId(),
                                lesson.getId()
                        )
                        .stream()
                        .collect(Collectors.toMap(
                                progress -> progress.getExercise().getId(),
                                Function.identity()
                        ));

        int totalExercises = activeExercises.size();
        int exercisesCompleted = 0;
        int totalScore = 0;

        for (Exercise exercise : activeExercises) {

            UserExerciseProgress exerciseProgress =
                    progressByExercise.get(exercise.getId());

            if (exerciseProgress == null) {
                continue;
            }

            if (Boolean.TRUE.equals(exerciseProgress.getCompleted())) {
                exercisesCompleted++;
            }

            totalScore += exerciseProgress.getScore() == null
                    ? 0
                    : exerciseProgress.getScore();
        }

        int score = totalExercises == 0
                ? 0
                : (int) Math.round(
                totalScore * 1.0 / totalExercises
        );

        double percentage = totalExercises == 0
                ? 0.0
                : exercisesCompleted * 100.0 / totalExercises;

        boolean completed = totalExercises > 0
                && exercisesCompleted == totalExercises;

        UserProgress progress = progressRepository
                .findByUserIdAndLessonId(
                        user.getId(),
                        lesson.getId()
                )
                .orElseGet(() ->
                        UserProgress.builder()
                                .user(user)
                                .lesson(lesson)
                                .build()
                );

        progress.setCompleted(completed);
        progress.setScore(score);
        progress.setPercentage(percentage);
        progress.setExercisesCompleted(exercisesCompleted);

        progress.setCurrentSection(Math.max(
                progress.getCurrentSection() == null
                        ? 0
                        : progress.getCurrentSection(),
                request.getCurrentSection()
        ));

        progress.setTotalStudyTime(Math.max(
                progress.getTotalStudyTime() == null
                        ? 0
                        : progress.getTotalStudyTime(),
                request.getTotalStudyTime()
        ));

        progress.setLastAccess(LocalDateTime.now());

        UserProgress saved = progressRepository.save(progress);

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