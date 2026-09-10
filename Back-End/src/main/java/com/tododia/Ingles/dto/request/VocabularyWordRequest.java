package com.tododia.Ingles.dto.request;

import com.tododia.Ingles.enums.EnglishLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VocabularyWordRequest {

    @NotBlank
    private String english;

    @NotBlank
    private String portuguese;

    private String pronunciation;

    private String audioUrl;

    private String imageUrl;

    private String exampleEnglish;

    private String examplePortuguese;

    private String observation;

    private EnglishLevel level;

    @NotNull
    private Long categoryId;
}