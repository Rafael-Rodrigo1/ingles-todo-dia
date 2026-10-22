package com.tododia.Ingles.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserExerciseProgressResponse {

    private Long id;

    private Long exerciseId;

    // Histórico do aluno
    private Boolean completed;
    private Integer score;
    private Integer attempts;
    private LocalDateTime lastAttempt;

    // Resultado da tentativa atual
    private Integer attemptScore;
    private Boolean attemptPassed;
}