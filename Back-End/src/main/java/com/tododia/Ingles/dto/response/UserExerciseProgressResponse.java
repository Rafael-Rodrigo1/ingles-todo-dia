package com.tododia.Ingles.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserExerciseProgressResponse {

    private Long id;

    private Long exerciseId;

    private Boolean completed;

    private Integer score;

    private Integer attempts;

    private LocalDateTime lastAttempt;
}
