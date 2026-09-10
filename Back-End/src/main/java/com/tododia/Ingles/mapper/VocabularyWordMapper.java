package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.VocabularyWordRequest;
import com.tododia.Ingles.dto.response.VocabularyWordResponse;
import com.tododia.Ingles.entity.VocabularyWord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface VocabularyWordMapper {

    @Mapping(target = "category", ignore = true)
    VocabularyWord toEntity(VocabularyWordRequest request);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    VocabularyWordResponse toResponse(VocabularyWord word);

    List<VocabularyWordResponse> toResponseList(
            List<VocabularyWord> words
    );
}