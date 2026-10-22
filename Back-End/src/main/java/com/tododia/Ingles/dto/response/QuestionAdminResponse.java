
package com.tododia.Ingles.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuestionAdminResponse {

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
