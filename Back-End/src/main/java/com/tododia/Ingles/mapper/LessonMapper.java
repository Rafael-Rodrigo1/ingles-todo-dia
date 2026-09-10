package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.LessonRequest;
import com.tododia.Ingles.dto.response.LessonResponse;
import com.tododia.Ingles.entity.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "progress", ignore = true)
    @Mapping(target = "exercises", ignore = true)
    @Mapping(target = "sections", ignore = true)
    Lesson toEntity(LessonRequest request);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    LessonResponse toResponse(Lesson lesson);

    List<LessonResponse> toResponseList(List<Lesson> lessons);
}