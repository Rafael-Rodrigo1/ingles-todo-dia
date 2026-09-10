package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.UserProgressRequest;
import com.tododia.Ingles.dto.response.UserProgressResponse;
import com.tododia.Ingles.entity.UserProgress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserProgressMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "lastAccess", ignore = true)
    UserProgress toEntity(UserProgressRequest request);

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    UserProgressResponse toResponse(UserProgress progress);

    List<UserProgressResponse> toResponseList(
            List<UserProgress> progressList
    );
}