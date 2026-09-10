package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExampleRequest {

    @NotBlank
    private String english;

    @NotBlank
    private String portuguese;

    private String explanation;

    private String audioUrl;

    @NotNull
    private Long lessonSectionId;
}
