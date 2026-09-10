package com.tododia.Ingles.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlternativeResponse {

    private Long id;

    private String text;

    private Boolean correct;

    private Long questionId;

    private String questionStatement;
}
