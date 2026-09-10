package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.AlternativeRequest;
import com.tododia.Ingles.dto.response.AlternativeResponse;
import com.tododia.Ingles.entity.Alternative;
import com.tododia.Ingles.entity.Question;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.AlternativeMapper;
import com.tododia.Ingles.repository.AlternativeRepository;
import com.tododia.Ingles.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AlternativeService {

    private final AlternativeRepository alternativeRepository;
    private final QuestionRepository questionRepository;
    private final AlternativeMapper mapper;

    public AlternativeResponse create(AlternativeRequest request) {

        Question question = questionRepository
                .findById(request.getQuestionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Questão não encontrada."
                        ));

        Alternative alternative = mapper.toEntity(request);

        alternative.setQuestion(question);

        Alternative saved = alternativeRepository.save(alternative);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AlternativeResponse> findAll() {

        return mapper.toResponseList(
                alternativeRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public AlternativeResponse findById(Long id) {

        Alternative alternative = alternativeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Alternativa não encontrada."
                        ));

        return mapper.toResponse(alternative);
    }

    @Transactional(readOnly = true)
    public List<AlternativeResponse> findByQuestion(Long questionId) {

        if (!questionRepository.existsById(questionId)) {
            throw new ResourceNotFoundException(
                    "Questão não encontrada."
            );
        }

        return mapper.toResponseList(
                alternativeRepository.findByQuestionId(questionId)
        );
    }

    public AlternativeResponse update(
            Long id,
            AlternativeRequest request) {

        Alternative alternative = alternativeRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Alternativa não encontrada."
                        ));

        Question question = questionRepository
                .findById(request.getQuestionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Questão não encontrada."
                        ));

        alternative.setText(request.getText());
        alternative.setCorrect(request.getCorrect());
        alternative.setQuestion(question);

        Alternative updated =
                alternativeRepository.save(alternative);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!alternativeRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Alternativa não encontrada."
            );
        }

        alternativeRepository.deleteById(id);
    }
}
