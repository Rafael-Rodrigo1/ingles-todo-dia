package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProgressRequest {

    @NotNull
    private Long lessonId;

    @NotNull
    private Boolean completed;

    @NotNull
    @PositiveOrZero
    private Integer score;

    @NotNull
    @Min(0)
    @Max(100)
    private Double percentage;

    @NotNull
    @PositiveOrZero
    private Integer currentSection;

    @NotNull
    @PositiveOrZero
    private Integer exercisesCompleted;

    @NotNull
    @PositiveOrZero
    private Integer totalStudyTime;
}
