package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.ImageRequest;
import com.tododia.Ingles.dto.response.ImageResponse;
import com.tododia.Ingles.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    @Mapping(target = "lessonSection", ignore = true)
    Image toEntity(ImageRequest request);

    @Mapping(target = "lessonSectionId", source = "lessonSection.id")
    @Mapping(target = "lessonSectionTitle", source = "lessonSection.title")
    ImageResponse toResponse(Image image);

    List<ImageResponse> toResponseList(List<Image> images);
}
