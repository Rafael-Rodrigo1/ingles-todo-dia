package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudySessionRequest {

    @NotNull
    private Long lessonId;
}