package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.QuestionRequest;
import com.tododia.Ingles.dto.response.QuestionResponse;
import com.tododia.Ingles.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuestionMapper {

    @Mapping(target = "exercise", ignore = true)
    @Mapping(target = "alternatives", ignore = true)
    Question toEntity(QuestionRequest request);

    @Mapping(target = "exerciseId", source = "exercise.id")
    @Mapping(target = "exerciseTitle", source = "exercise.title")
    QuestionResponse toResponse(Question question);

    List<QuestionResponse> toResponseList(List<Question> questions);
}
