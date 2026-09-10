package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.AudioRequest;
import com.tododia.Ingles.dto.response.AudioResponse;
import com.tododia.Ingles.entity.Audio;
import com.tododia.Ingles.entity.LessonSection;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.AudioMapper;
import com.tododia.Ingles.repository.AudioRepository;
import com.tododia.Ingles.repository.LessonSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AudioService {

    private final AudioRepository audioRepository;
    private final LessonSectionRepository lessonSectionRepository;
    private final AudioMapper mapper;

    public AudioResponse create(AudioRequest request) {

        LessonSection lessonSection = lessonSectionRepository
                .findById(request.getLessonSectionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seção da lição não encontrada."
                        ));

        Audio audio = mapper.toEntity(request);

        audio.setLessonSection(lessonSection);

        Audio saved = audioRepository.save(audio);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AudioResponse> findAll() {

        return mapper.toResponseList(
                audioRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public AudioResponse findById(Long id) {

        Audio audio = audioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Áudio não encontrado."
                        ));

        return mapper.toResponse(audio);
    }

    @Transactional(readOnly = true)
    public List<AudioResponse> findBySection(Long lessonSectionId) {

        if (!lessonSectionRepository.existsById(lessonSectionId)) {
            throw new ResourceNotFoundException(
                    "Seção da lição não encontrada."
            );
        }

        return mapper.toResponseList(
                audioRepository.findByLessonSectionId(lessonSectionId)
        );
    }

    public AudioResponse update(
            Long id,
            AudioRequest request) {

        Audio audio = audioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Áudio não encontrado."
                        ));

        LessonSection lessonSection = lessonSectionRepository
                .findById(request.getLessonSectionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seção da lição não encontrada."
                        ));

        audio.setUrl(request.getUrl());
        audio.setDuration(request.getDuration());
        audio.setTranscript(request.getTranscript());
        audio.setLessonSection(lessonSection);

        Audio updated = audioRepository.save(audio);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!audioRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Áudio não encontrado."
            );
        }

        audioRepository.deleteById(id);
    }
}
