package com.tododia.Ingles.dto.response;

import com.tododia.Ingles.enums.EnglishLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VocabularyWordResponse {

    private Long id;

    private String english;

    private String portuguese;

    private String pronunciation;

    private String audioUrl;

    private String imageUrl;

    private String exampleEnglish;

    private String examplePortuguese;

    private String observation;

    private EnglishLevel level;

    private Long categoryId;

    private String categoryName;
}