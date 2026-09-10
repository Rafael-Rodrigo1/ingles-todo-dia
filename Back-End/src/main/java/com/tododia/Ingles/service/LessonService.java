package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.LessonRequest;
import com.tododia.Ingles.dto.response.LessonResponse;
import com.tododia.Ingles.entity.Category;
import com.tododia.Ingles.entity.Lesson;
import com.tododia.Ingles.exception.DuplicateResourceException;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.LessonMapper;
import com.tododia.Ingles.repository.CategoryRepository;
import com.tododia.Ingles.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CategoryRepository categoryRepository;
    private final LessonMapper mapper;

    public LessonResponse create(LessonRequest request) {

        if (lessonRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Já existe uma lição com esse slug.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoria não encontrada."));

        Lesson lesson = mapper.toEntity(request);
        lesson.setCategory(category);

        Lesson saved = lessonRepository.save(lesson);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> findAll() {

        return mapper.toResponseList(lessonRepository.findAll());
    }

    @Transactional(readOnly = true)
    public LessonResponse findById(Long id) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lição não encontrada."));

        return mapper.toResponse(lesson);
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> findByCategory(Long categoryId) {

        return mapper.toResponseList(
                lessonRepository.findByCategoryId(categoryId)
        );
    }

    public LessonResponse update(Long id, LessonRequest request) {

        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lição não encontrada."));

        if (!lesson.getSlug().equals(request.getSlug())
                && lessonRepository.existsBySlug(request.getSlug())) {

            throw new DuplicateResourceException("Já existe uma lição com esse slug.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoria não encontrada."));

        lesson.setTitle(request.getTitle());
        lesson.setSlug(request.getSlug());
        lesson.setDescription(request.getDescription());
        lesson.setShortDescription(request.getShortDescription());
        lesson.setDifficulty(request.getDifficulty());
        lesson.setLevel(request.getLevel());
        lesson.setEstimatedTime(request.getEstimatedTime());
        lesson.setThumbnail(request.getThumbnail());
        lesson.setPublished(request.getPublished());
        lesson.setOrderIndex(request.getOrderIndex());
        lesson.setCategory(category);

        Lesson updated = lessonRepository.save(lesson);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!lessonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lição não encontrada.");
        }

        lessonRepository.deleteById(id);
    }

}
