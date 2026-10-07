package com.tododia.Ingles.dto.response;

import com.tododia.Ingles.enums.RoleName;
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
public class AdminUserResponse {

    private Long id;

    private String name;

    private String email;

    private Boolean enabled;

    private Boolean emailVerified;

    private String profileImage;

    private LocalDateTime lastLogin;

    private RoleName role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
