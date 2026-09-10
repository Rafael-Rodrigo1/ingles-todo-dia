package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.VocabularyWordRequest;
import com.tododia.Ingles.dto.response.VocabularyWordResponse;
import com.tododia.Ingles.entity.VocabularyCategory;
import com.tododia.Ingles.entity.VocabularyWord;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.VocabularyWordMapper;
import com.tododia.Ingles.repository.VocabularyCategoryRepository;
import com.tododia.Ingles.repository.VocabularyWordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VocabularyWordService {

    private final VocabularyWordRepository wordRepository;
    private final VocabularyCategoryRepository categoryRepository;
    private final VocabularyWordMapper mapper;

    public VocabularyWordResponse create(VocabularyWordRequest request) {

        VocabularyCategory category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoria de vocabulário não encontrada."
                        ));

        VocabularyWord word = mapper.toEntity(request);

        word.setCategory(category);

        VocabularyWord saved = wordRepository.save(word);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VocabularyWordResponse> findAll() {

        return mapper.toResponseList(
                wordRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public VocabularyWordResponse findById(Long id) {

        VocabularyWord word = wordRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Palavra de vocabulário não encontrada."
                        ));

        return mapper.toResponse(word);
    }

    @Transactional(readOnly = true)
    public List<VocabularyWordResponse> findByCategory(Long categoryId) {

        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException(
                    "Categoria de vocabulário não encontrada."
            );
        }

        return mapper.toResponseList(
                wordRepository
                        .findByCategoryIdOrderByEnglishAsc(categoryId)
        );
    }

    public VocabularyWordResponse update(
            Long id,
            VocabularyWordRequest request) {

        VocabularyWord word = wordRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Palavra de vocabulário não encontrada."
                        ));

        VocabularyCategory category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoria de vocabulário não encontrada."
                        ));

        word.setEnglish(request.getEnglish());
        word.setPortuguese(request.getPortuguese());
        word.setPronunciation(request.getPronunciation());
        word.setAudioUrl(request.getAudioUrl());
        word.setImageUrl(request.getImageUrl());
        word.setExampleEnglish(request.getExampleEnglish());
        word.setExamplePortuguese(request.getExamplePortuguese());
        word.setObservation(request.getObservation());
        word.setLevel(request.getLevel());
        word.setCategory(category);

        VocabularyWord updated = wordRepository.save(word);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!wordRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Palavra de vocabulário não encontrada."
            );
        }

        wordRepository.deleteById(id);
    }
}