package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlternativeRequest {

    @NotBlank
    private String text;

    @NotNull
    private Boolean correct;

    @NotNull
    private Long questionId;
}
