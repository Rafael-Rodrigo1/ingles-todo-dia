package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.response.FavoriteResponse;
import com.tododia.Ingles.entity.Favorite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FavoriteMapper {

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    @Mapping(target = "lessonSlug", source = "lesson.slug")
    FavoriteResponse toResponse(Favorite favorite);

    List<FavoriteResponse> toResponseList(
            List<Favorite> favorites
    );
}