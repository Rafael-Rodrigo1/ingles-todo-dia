package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.AlternativeRequest;
import com.tododia.Ingles.dto.response.AlternativeResponse;
import com.tododia.Ingles.entity.Alternative;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AlternativeMapper {

    @Mapping(target = "question", ignore = true)
    Alternative toEntity(AlternativeRequest request);

    @Mapping(target = "questionId", source = "question.id")
    @Mapping(target = "questionStatement", source = "question.statement")
    AlternativeResponse toResponse(Alternative alternative);

    List<AlternativeResponse> toResponseList(List<Alternative> alternatives);
}
