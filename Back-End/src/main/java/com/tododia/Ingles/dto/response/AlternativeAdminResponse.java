
package com.tododia.Ingles.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AlternativeAdminResponse {

    private Long id;

    private String text;

    private Boolean correct;

    private Long questionId;

    private String questionStatement;
}
