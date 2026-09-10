package com.tododia.Ingles.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgressResponse {

    private Long id;

    private Boolean completed;

    private Integer score;

    private Double percentage;

    private LocalDateTime lastAccess;

    private Integer currentSection;

    private Integer exercisesCompleted;

    private Integer totalStudyTime;

    private Long lessonId;

    private String lessonTitle;
}