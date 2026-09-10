package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AudioRequest {

    @NotBlank
    private String url;

    private Integer duration;

    private String transcript;

    @NotNull
    private Long lessonSectionId;
}