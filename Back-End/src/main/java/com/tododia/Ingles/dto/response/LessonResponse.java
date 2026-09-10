package com.tododia.Ingles.dto.response;

import com.tododia.Ingles.enums.Difficulty;
import com.tododia.Ingles.enums.EnglishLevel;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponse {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private String shortDescription;

    private Difficulty difficulty;

    private EnglishLevel level;

    private Integer estimatedTime;

    private String thumbnail;

    private Boolean published;

    private Integer orderIndex;

    private Long categoryId;

    private String categoryName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
