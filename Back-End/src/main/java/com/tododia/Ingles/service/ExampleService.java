package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.ExampleRequest;
import com.tododia.Ingles.dto.response.ExampleResponse;
import com.tododia.Ingles.entity.Example;
import com.tododia.Ingles.entity.LessonSection;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.ExampleMapper;
import com.tododia.Ingles.repository.ExampleRepository;
import com.tododia.Ingles.repository.LessonSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExampleService {

    private final ExampleRepository exampleRepository;
    private final LessonSectionRepository lessonSectionRepository;
    private final ExampleMapper mapper;

    public ExampleResponse create(ExampleRequest request) {

        LessonSection lessonSection = lessonSectionRepository
                .findById(request.getLessonSectionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seção da lição não encontrada."));

        Example example = mapper.toEntity(request);

        example.setLessonSection(lessonSection);

        Example saved = exampleRepository.save(example);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ExampleResponse> findAll() {

        return mapper.toResponseList(
                exampleRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public ExampleResponse findById(Long id) {

        Example example = exampleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exemplo não encontrado."));

        return mapper.toResponse(example);
    }

    @Transactional(readOnly = true)
    public List<ExampleResponse> findBySection(Long lessonSectionId) {

        if (!lessonSectionRepository.existsById(lessonSectionId)) {
            throw new ResourceNotFoundException(
                    "Seção da lição não encontrada."
            );
        }

        return mapper.toResponseList(
                exampleRepository.findByLessonSectionId(lessonSectionId)
        );
    }

    public ExampleResponse update(
            Long id,
            ExampleRequest request) {

        Example example = exampleRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exemplo não encontrado."));

        LessonSection lessonSection = lessonSectionRepository
                .findById(request.getLessonSectionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seção da lição não encontrada."
                        ));

        example.setEnglish(request.getEnglish());
        example.setPortuguese(request.getPortuguese());
        example.setExplanation(request.getExplanation());
        example.setAudioUrl(request.getAudioUrl());
        example.setLessonSection(lessonSection);

        Example updated = exampleRepository.save(example);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!exampleRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Exemplo não encontrado."
            );
        }

        exampleRepository.deleteById(id);
    }
}