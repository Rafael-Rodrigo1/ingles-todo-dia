package com.tododia.Ingles.dto.response;

import com.tododia.Ingles.enums.SectionType;
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
public class LessonSectionResponse {

    private Long id;

    private String title;

    private String content;

    private SectionType type;

    private Integer orderIndex;

    private Long lessonId;

    private String lessonTitle;
}