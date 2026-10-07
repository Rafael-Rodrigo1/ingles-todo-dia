package com.tododia.Ingles.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserEnabledRequest {

    @NotNull
    private Boolean enabled;
}