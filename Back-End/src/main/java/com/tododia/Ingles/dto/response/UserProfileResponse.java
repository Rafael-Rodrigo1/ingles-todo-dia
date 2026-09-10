package com.tododia.Ingles.dto.response;

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
public class UserProfileResponse {

    private Long id;

    private String name;

    private String email;

    private String profileImage;

    private Boolean enabled;

    private Boolean emailVerified;

    private LocalDateTime lastLogin;

    private String role;
}
