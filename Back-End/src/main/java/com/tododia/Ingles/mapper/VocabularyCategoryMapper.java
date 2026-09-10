package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.VocabularyCategoryRequest;
import com.tododia.Ingles.dto.response.VocabularyCategoryResponse;
import com.tododia.Ingles.entity.VocabularyCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VocabularyCategoryMapper {

    @Mapping(target = "words", ignore = true)
    VocabularyCategory toEntity(VocabularyCategoryRequest request);

    VocabularyCategoryResponse toResponse(VocabularyCategory category);

    List<VocabularyCategoryResponse> toResponseList(
            List<VocabularyCategory> categories
    );
}
