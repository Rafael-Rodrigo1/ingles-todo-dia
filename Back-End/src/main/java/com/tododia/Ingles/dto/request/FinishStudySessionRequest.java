package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FinishStudySessionRequest {

    @NotNull
    @PositiveOrZero
    private Integer score;

    @NotNull
    @PositiveOrZero
    private Integer correctAnswers;

    @NotNull
    @PositiveOrZero
    private Integer wrongAnswers;

    @NotNull
    private Boolean completed;
}