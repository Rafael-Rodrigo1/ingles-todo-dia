package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.ExerciseRequest;
import com.tododia.Ingles.dto.response.ExerciseResponse;
import com.tododia.Ingles.entity.Exercise;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExerciseMapper {

    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "questions", ignore = true)
    Exercise toEntity(ExerciseRequest request);

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    ExerciseResponse toResponse(Exercise exercise);

    List<ExerciseResponse> toResponseList(List<Exercise> exercises);
}