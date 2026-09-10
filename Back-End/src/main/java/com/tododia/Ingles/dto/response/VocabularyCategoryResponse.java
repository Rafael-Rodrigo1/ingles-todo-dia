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
public class VocabularyCategoryResponse {

    private Long id;

    private String name;

    private String slug;

    private String description;

    private String icon;

    private Boolean active;

    private Integer orderIndex;
}
