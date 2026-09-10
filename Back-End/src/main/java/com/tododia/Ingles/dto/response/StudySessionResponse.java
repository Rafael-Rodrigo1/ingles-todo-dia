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
public class StudySessionResponse {

    private Long id;

    private Long lessonId;

    private String lessonTitle;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer duration;

    private Integer score;

    private Integer correctAnswers;

    private Integer wrongAnswers;

    private Boolean completed;
}
