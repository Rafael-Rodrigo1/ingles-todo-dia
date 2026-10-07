package com.tododia.Ingles.dto.request;

import com.tododia.Ingles.enums.RoleName;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRoleRequest {

    @NotNull
    private RoleName role;
}
