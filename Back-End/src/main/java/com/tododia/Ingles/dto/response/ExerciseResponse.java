package com.tododia.Ingles.dto.response;

import com.tododia.Ingles.enums.ExerciseDifficulty;
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
public class ExerciseResponse {

    private Long id;

    private String title;

    private String description;

    private Integer passingScore;

    private Integer orderIndex;

    private Boolean active;

    private Integer timeLimit;

    private ExerciseDifficulty difficulty;

    private Long lessonId;

    private String lessonTitle;
}
