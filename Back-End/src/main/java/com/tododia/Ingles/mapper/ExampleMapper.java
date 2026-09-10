package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.ExampleRequest;
import com.tododia.Ingles.dto.response.ExampleResponse;
import com.tododia.Ingles.entity.Example;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExampleMapper {

    @Mapping(target = "lessonSection", ignore = true)
    Example toEntity(ExampleRequest request);

    @Mapping(target = "lessonSectionId", source = "lessonSection.id")
    @Mapping(target = "lessonSectionTitle", source = "lessonSection.title")
    ExampleResponse toResponse(Example example);

    List<ExampleResponse> toResponseList(List<Example> examples);
}