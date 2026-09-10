package com.tododia.Ingles.dto.request;

import com.tododia.Ingles.enums.Difficulty;
import com.tododia.Ingles.enums.EnglishLevel;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String slug;

    @Size(max = 500)
    private String description;

    @NotNull
    private Difficulty difficulty;

    @NotNull
    private EnglishLevel level;

    @NotNull
    @Positive
    private Integer estimatedTime;

    private String thumbnail;

    private Boolean published;

    @PositiveOrZero
    private Integer orderIndex;

    private String shortDescription;

    @NotNull
    private Long categoryId;

}
