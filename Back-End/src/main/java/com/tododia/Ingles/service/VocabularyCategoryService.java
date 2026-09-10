package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.VocabularyCategoryRequest;
import com.tododia.Ingles.dto.response.VocabularyCategoryResponse;
import com.tododia.Ingles.entity.VocabularyCategory;
import com.tododia.Ingles.exception.DuplicateResourceException;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.VocabularyCategoryMapper;
import com.tododia.Ingles.repository.VocabularyCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VocabularyCategoryService {

    private final VocabularyCategoryRepository repository;
    private final VocabularyCategoryMapper mapper;

    public VocabularyCategoryResponse create(
            VocabularyCategoryRequest request) {

        if (repository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Já existe uma categoria de vocabulário com esse nome."
            );
        }

        if (repository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException(
                    "Já existe uma categoria de vocabulário com esse slug."
            );
        }

        VocabularyCategory category = mapper.toEntity(request);

        VocabularyCategory saved = repository.save(category);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VocabularyCategoryResponse> findAll() {

        return mapper.toResponseList(
                repository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public VocabularyCategoryResponse findById(Long id) {

        VocabularyCategory category = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoria de vocabulário não encontrada."
                        ));

        return mapper.toResponse(category);
    }

    @Transactional(readOnly = true)
    public List<VocabularyCategoryResponse> findActive() {

        return mapper.toResponseList(
                repository.findByActiveTrueOrderByOrderIndexAsc()
        );
    }

    public VocabularyCategoryResponse update(
            Long id,
            VocabularyCategoryRequest request) {

        VocabularyCategory category = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoria de vocabulário não encontrada."
                        ));

        repository.findBySlug(request.getSlug())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Já existe uma categoria de vocabulário com esse slug."
                    );
                });

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setActive(request.getActive());
        category.setOrderIndex(request.getOrderIndex());

        VocabularyCategory updated = repository.save(category);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Categoria de vocabulário não encontrada."
            );
        }

        repository.deleteById(id);
    }
}
