package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserExerciseProgressRequest {

    @NotNull
    private Long exerciseId;

    @NotNull
    private Boolean completed;

    @NotNull
    @Min(0)
    @Max(100)
    private Integer score;
}