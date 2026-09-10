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
public class ExampleResponse {

    private Long id;

    private String english;

    private String portuguese;

    private String explanation;

    private String audioUrl;

    private Long lessonSectionId;

    private String lessonSectionTitle;
}

