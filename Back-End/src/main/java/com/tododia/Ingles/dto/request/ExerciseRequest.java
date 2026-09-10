package com.tododia.Ingles.dto.request;

import com.tododia.Ingles.enums.ExerciseDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExerciseRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Integer passingScore;

    @NotNull
    private Integer orderIndex;

    @NotNull
    private Boolean active;

    @NotNull
    private Integer timeLimit;

    @NotNull
    private ExerciseDifficulty difficulty;

    @NotNull
    private Long lessonId;
}