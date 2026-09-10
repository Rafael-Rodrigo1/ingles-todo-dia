package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.CategoryRequest;
import com.tododia.Ingles.dto.response.CategoryResponse;
import com.tododia.Ingles.entity.Category;
import com.tododia.Ingles.exception.DuplicateResourceException;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.CategoryMapper;
import com.tododia.Ingles.repository.CategoryRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper mapper;

    public CategoryResponse create(CategoryRequest request) {

        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Já existe uma categoria com esse slug.");
        }

        Category category = mapper.toEntity(request);

        Category saved = categoryRepository.save(category);

        return mapper.toResponse(saved);
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setOrderIndex(request.getOrderIndex());
        category.setActive(request.getActive());

        Category updated = categoryRepository.save(category);

        return mapper.toResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return mapper.toResponseList(categoryRepository.findAll());
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Categoria não encontrada."));

        return mapper.toResponse(category);

    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Categoria não encontrada.");
        }

        categoryRepository.deleteById(id);

    }
}


