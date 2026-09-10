package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserProfileRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 255)
    private String profileImage;
}