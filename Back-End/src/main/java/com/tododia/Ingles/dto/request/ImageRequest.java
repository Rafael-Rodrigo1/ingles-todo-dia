package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageRequest {

    @NotBlank
    private String url;

    private String description;

    private String altText;

    @NotNull
    private Long lessonSectionId;
}