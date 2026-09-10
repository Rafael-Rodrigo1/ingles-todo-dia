package com.tododia.Ingles.dto.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;

    private String type;

    private Long id;

    private String name;

    private String email;

    private String role;

}