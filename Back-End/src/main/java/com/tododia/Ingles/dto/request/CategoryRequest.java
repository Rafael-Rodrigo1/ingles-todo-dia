package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 80, message = "O nome deve possuir no máximo 80 caracteres.")
    private String name;

    @NotBlank(message = "O slug é obrigatório.")
    @Size(max = 80)
    private String slug;

    @Size(max = 255)
    private String description;

    @Size(max = 100)
    private String icon;

    @Size(max = 20)
    private String color;

    @PositiveOrZero
    private Integer orderIndex;

    @NotNull
    private Boolean active;
}