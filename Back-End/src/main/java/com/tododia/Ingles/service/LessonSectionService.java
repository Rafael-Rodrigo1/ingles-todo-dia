package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.LessonSectionRequest;
import com.tododia.Ingles.dto.response.LessonSectionResponse;
import com.tododia.Ingles.entity.Lesson;
import com.tododia.Ingles.entity.LessonSection;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.LessonSectionMapper;
import com.tododia.Ingles.repository.LessonRepository;
import com.tododia.Ingles.repository.LessonSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonSectionService {

    private final LessonSectionRepository lessonSectionRepository;
    private final LessonRepository lessonRepository;
    private final LessonSectionMapper mapper;

    public LessonSectionResponse create(LessonSectionRequest request) {

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lição não encontrada."));

        LessonSection section = mapper.toEntity(request);

        section.setLesson(lesson);

        LessonSection saved = lessonSectionRepository.save(section);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LessonSectionResponse> findAll() {

        return mapper.toResponseList(
                lessonSectionRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public LessonSectionResponse findById(Long id) {

        LessonSection section = lessonSectionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seção não encontrada."));

        return mapper.toResponse(section);
    }

    @Transactional(readOnly = true)
    public List<LessonSectionResponse> findByLesson(Long lessonId) {

        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lição não encontrada.");
        }

        return mapper.toResponseList(
                lessonSectionRepository
                        .findByLessonIdOrderByOrderIndexAsc(lessonId)
        );
    }

    public LessonSectionResponse update(
            Long id,
            LessonSectionRequest request) {

        LessonSection section = lessonSectionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seção não encontrada."));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lição não encontrada."));

        section.setTitle(request.getTitle());
        section.setContent(request.getContent());
        section.setType(request.getType());
        section.setOrderIndex(request.getOrderIndex());
        section.setLesson(lesson);

        LessonSection updated =
                lessonSectionRepository.save(section);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!lessonSectionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Seção não encontrada.");
        }

        lessonSectionRepository.deleteById(id);
    }
}