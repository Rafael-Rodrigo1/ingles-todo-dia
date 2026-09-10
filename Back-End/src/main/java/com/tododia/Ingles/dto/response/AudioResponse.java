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
public class AudioResponse {

    private Long id;

    private String url;

    private Integer duration;

    private String transcript;

    private Long lessonSectionId;

    private String lessonSectionTitle;
}