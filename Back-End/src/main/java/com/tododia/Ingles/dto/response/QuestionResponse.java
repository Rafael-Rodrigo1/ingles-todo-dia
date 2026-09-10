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
public class QuestionResponse {

    private Long id;

    private String statement;

    private String explanation;

    private Integer orderIndex;

    private String imageUrl;

    private String audioUrl;

    private Integer points;

    private Long exerciseId;

    private String exerciseTitle;
}