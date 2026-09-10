package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.ExerciseRequest;
import com.tododia.Ingles.dto.response.ExerciseResponse;
import com.tododia.Ingles.entity.Exercise;
import com.tododia.Ingles.entity.Lesson;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.ExerciseMapper;
import com.tododia.Ingles.repository.ExerciseRepository;
import com.tododia.Ingles.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final LessonRepository lessonRepository;
    private final ExerciseMapper mapper;

    public ExerciseResponse create(ExerciseRequest request) {

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lição não encontrada."));

        Exercise exercise = mapper.toEntity(request);

        exercise.setLesson(lesson);

        Exercise saved = exerciseRepository.save(exercise);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ExerciseResponse> findAll() {

        return mapper.toResponseList(
                exerciseRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public ExerciseResponse findById(Long id) {

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exercício não encontrado."));

        return mapper.toResponse(exercise);
    }

    @Transactional(readOnly = true)
    public List<ExerciseResponse> findByLesson(Long lessonId) {

        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lição não encontrada.");
        }

        return mapper.toResponseList(
                exerciseRepository.findByLessonId(lessonId)
        );
    }

    public ExerciseResponse update(
            Long id,
            ExerciseRequest request) {

        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exercício não encontrado."));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lição não encontrada."));

        exercise.setTitle(request.getTitle());
        exercise.setDescription(request.getDescription());
        exercise.setPassingScore(request.getPassingScore());
        exercise.setOrderIndex(request.getOrderIndex());
        exercise.setActive(request.getActive());
        exercise.setTimeLimit(request.getTimeLimit());
        exercise.setDifficulty(request.getDifficulty());
        exercise.setLesson(lesson);

        Exercise updated = exerciseRepository.save(exercise);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!exerciseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exercício não encontrado.");
        }

        exerciseRepository.deleteById(id);
    }
}
