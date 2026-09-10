package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionRequest {

    @NotBlank
    private String statement;

    private String explanation;

    @NotNull
    private Integer orderIndex;

    private String imageUrl;

    private String audioUrl;

    @NotNull
    @Positive
    private Integer points;

    @NotNull
    private Long exerciseId;
}