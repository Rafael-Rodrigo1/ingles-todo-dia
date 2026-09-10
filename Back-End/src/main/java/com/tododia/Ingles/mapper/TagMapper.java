package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.TagRequest;
import com.tododia.Ingles.dto.response.TagResponse;
import com.tododia.Ingles.entity.Tag;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TagMapper {

    Tag toEntity(TagRequest request);

    TagResponse toResponse(Tag tag);

    List<TagResponse> toResponseList(List<Tag> tags);
}