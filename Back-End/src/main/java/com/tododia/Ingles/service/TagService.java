package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.TagRequest;
import com.tododia.Ingles.dto.response.TagResponse;
import com.tododia.Ingles.entity.Tag;
import com.tododia.Ingles.exception.DuplicateResourceException;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.TagMapper;
import com.tododia.Ingles.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TagService {

    private final TagRepository tagRepository;
    private final TagMapper mapper;

    public TagResponse create(TagRequest request) {

        if (tagRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException(
                    "Já existe uma tag com esse slug."
            );
        }

        if (tagRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Já existe uma tag com esse nome."
            );
        }

        Tag tag = mapper.toEntity(request);

        Tag saved = tagRepository.save(tag);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TagResponse> findAll() {

        return mapper.toResponseList(
                tagRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public TagResponse findById(Long id) {

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tag não encontrada."
                        ));

        return mapper.toResponse(tag);
    }

    @Transactional(readOnly = true)
    public TagResponse findBySlug(String slug) {

        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tag não encontrada."
                        ));

        return mapper.toResponse(tag);
    }

    public TagResponse update(
            Long id,
            TagRequest request) {

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tag não encontrada."
                        ));

        tagRepository.findBySlug(request.getSlug())
                .filter(existing ->
                        !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new DuplicateResourceException(
                            "Já existe uma tag com esse slug."
                    );
                });

        /*
         * Como o repository possui apenas existsByName(),
         * precisamos evitar rejeitar o próprio nome da Tag
         * durante uma atualização normal.
         */
        if (!tag.getName().equals(request.getName())
                && tagRepository.existsByName(request.getName())) {

            throw new DuplicateResourceException(
                    "Já existe uma tag com esse nome."
            );
        }

        tag.setName(request.getName());
        tag.setSlug(request.getSlug());

        Tag updated = tagRepository.save(tag);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Tag não encontrada."
                        ));

        tagRepository.delete(tag);
    }
}