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
import com.tododia.Ingles.entity.Question;
import com.tododia.Ingles.entity.Alternative;
import com.tododia.Ingles.repository.QuestionRepository;
import com.tododia.Ingles.repository.AlternativeRepository;

import java.util.Map;
import java.util.Set;
import java.util.HashMap;
import java.util.HashSet;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserExerciseProgressService {

    private final UserExerciseProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final QuestionRepository questionRepository;
    private final AlternativeRepository alternativeRepository;


    public UserExerciseProgressResponse saveProgress(
            UserExerciseProgressRequest request) {

        User user = getAuthenticatedUser();

        Exercise exercise = exerciseRepository
                .findById(request.getExerciseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exercício não encontrado."
                        ));

        if (!Boolean.TRUE.equals(exercise.getActive())) {
            throw new IllegalArgumentException(
                    "Este exercício não está ativo."
            );
        }

        List<Question> questions = questionRepository
                .findByExerciseIdOrderByOrderIndexAsc(exercise.getId());

        if (questions.isEmpty()) {
            throw new IllegalArgumentException(
                    "O exercício não possui perguntas."
            );
        }

        Map<Long, Long> selectedAnswers = new HashMap<>();

        for (UserExerciseProgressRequest.Answer answer : request.getAnswers()) {
            if (selectedAnswers.putIfAbsent(
                    answer.getQuestionId(),
                    answer.getAlternativeId()
            ) != null) {
                throw new IllegalArgumentException(
                        "Uma pergunta foi respondida mais de uma vez."
                );
            }
        }

        Set<Long> questionIds = new HashSet<>();
        long totalPoints = 0;
        long earnedPoints = 0;

        for (Question question : questions) {
            questionIds.add(question.getId());

            int points = question.getPoints() != null
                    ? question.getPoints()
                    : 0;

            if (points <= 0) {
                throw new IllegalArgumentException(
                        "Uma pergunta possui pontuação inválida."
                );
            }

            totalPoints += points;

            Long alternativeId = selectedAnswers.get(question.getId());

            if (alternativeId == null) {
                throw new IllegalArgumentException(
                        "Todas as perguntas devem ser respondidas."
                );
            }

            Alternative selectedAlternative = alternativeRepository
                    .findById(alternativeId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Alternativa inválida."
                            ));

            if (!selectedAlternative.getQuestion().getId()
                    .equals(question.getId())) {
                throw new IllegalArgumentException(
                        "A alternativa não pertence à pergunta."
                );
            }

            if (Boolean.TRUE.equals(selectedAlternative.getCorrect())) {
                earnedPoints += points;
            }
        }

        if (!questionIds.equals(selectedAnswers.keySet())) {
            throw new IllegalArgumentException(
                    "A requisição contém perguntas inválidas."
            );
        }

        int attemptScore = (int) Math.round(
                earnedPoints * 100.0 / totalPoints
        );

        boolean attemptPassed =
                attemptScore >= exercise.getPassingScore();

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

        boolean alreadyCompleted =
                Boolean.TRUE.equals(progress.getCompleted());

        int previousScore = progress.getScore() != null
                ? progress.getScore()
                : 0;

        int previousAttempts = progress.getAttempts() != null
                ? progress.getAttempts()
                : 0;

        progress.setCompleted(alreadyCompleted || attemptPassed);
        progress.setScore(Math.max(previousScore, attemptScore));
        progress.setAttempts(previousAttempts + 1);
        progress.setLastAttempt(LocalDateTime.now());

        UserExerciseProgress saved = progressRepository.save(progress);

        return UserExerciseProgressResponse.builder()
                .id(saved.getId())
                .exerciseId(exercise.getId())
                .completed(saved.getCompleted())
                .score(saved.getScore())
                .attempts(saved.getAttempts())
                .lastAttempt(saved.getLastAttempt())
                .attemptScore(attemptScore)
                .attemptPassed(attemptPassed)
                .build();
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
