package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.QuestionRequest;
import com.tododia.Ingles.dto.response.QuestionResponse;
import com.tododia.Ingles.entity.Exercise;
import com.tododia.Ingles.entity.Question;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.QuestionMapper;
import com.tododia.Ingles.repository.ExerciseRepository;
import com.tododia.Ingles.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExerciseRepository exerciseRepository;
    private final QuestionMapper mapper;

    public QuestionResponse create(QuestionRequest request) {

        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exercício não encontrado."
                        ));

        Question question = mapper.toEntity(request);

        question.setExercise(exercise);

        Question saved = questionRepository.save(question);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> findAll() {

        return mapper.toResponseList(
                questionRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public QuestionResponse findById(Long id) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Questão não encontrada."
                        ));

        return mapper.toResponse(question);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> findByExercise(Long exerciseId) {

        if (!exerciseRepository.existsById(exerciseId)) {
            throw new ResourceNotFoundException(
                    "Exercício não encontrado."
            );
        }

        return mapper.toResponseList(
                questionRepository
                        .findByExerciseIdOrderByOrderIndexAsc(exerciseId)
        );
    }

    public QuestionResponse update(
            Long id,
            QuestionRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Questão não encontrada."
                        ));

        Exercise exercise = exerciseRepository
                .findById(request.getExerciseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exercício não encontrado."
                        ));

        question.setStatement(request.getStatement());
        question.setExplanation(request.getExplanation());
        question.setOrderIndex(request.getOrderIndex());
        question.setImageUrl(request.getImageUrl());
        question.setAudioUrl(request.getAudioUrl());
        question.setPoints(request.getPoints());
        question.setExercise(exercise);

        Question updated = questionRepository.save(question);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Questão não encontrada."
            );
        }

        questionRepository.deleteById(id);
    }
}