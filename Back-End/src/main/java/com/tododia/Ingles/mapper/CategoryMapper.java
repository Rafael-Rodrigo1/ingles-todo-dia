package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.CategoryRequest;
import com.tododia.Ingles.dto.response.CategoryResponse;
import com.tododia.Ingles.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CategoryMapper {

    Category toEntity(CategoryRequest request);

    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

}