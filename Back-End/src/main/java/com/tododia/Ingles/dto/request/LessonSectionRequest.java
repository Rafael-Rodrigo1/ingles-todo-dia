package com.tododia.Ingles.dto.request;

import com.tododia.Ingles.enums.SectionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LessonSectionRequest {

    @NotBlank
    private String title;

    private String content;

    @NotNull
    private SectionType type;

    @NotNull
    private Integer orderIndex;

    @NotNull
    private Long lessonId;
}