package com.tododia.Ingles.dto.request;

import com.tododia.Ingles.enums.EnglishLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VocabularyRequest {
    @NotBlank
    private String english;

    @NotBlank
    private String portuguese;

    private String pronunciation;

    private String audioUrl;

    @NotNull
    private Long vocabularyCategoryId;

    @NotNull
    private EnglishLevel level;
}
