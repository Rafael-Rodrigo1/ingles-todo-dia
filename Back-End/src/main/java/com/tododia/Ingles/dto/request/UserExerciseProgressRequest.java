package com.tododia.Ingles.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserExerciseProgressRequest {

    @NotNull
    private Long exerciseId;

    @Valid
    @NotEmpty
    private List<Answer> answers;

    @Getter
    @Setter
    public static class Answer {

        @NotNull
        private Long questionId;

        @NotNull
        private Long alternativeId;
    }
}