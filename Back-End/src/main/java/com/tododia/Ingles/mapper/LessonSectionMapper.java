package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.LessonSectionRequest;
import com.tododia.Ingles.dto.response.LessonSectionResponse;
import com.tododia.Ingles.entity.LessonSection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonSectionMapper {

    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "audios", ignore = true)
    @Mapping(target = "examples", ignore = true)
    @Mapping(target = "images", ignore = true)
    LessonSection toEntity(LessonSectionRequest request);

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    LessonSectionResponse toResponse(LessonSection section);

    List<LessonSectionResponse> toResponseList(List<LessonSection> sections);
}