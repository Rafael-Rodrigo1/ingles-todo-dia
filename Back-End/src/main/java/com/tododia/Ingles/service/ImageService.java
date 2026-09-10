package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.ImageRequest;
import com.tododia.Ingles.dto.response.ImageResponse;
import com.tododia.Ingles.entity.Image;
import com.tododia.Ingles.entity.LessonSection;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.ImageMapper;
import com.tododia.Ingles.repository.ImageRepository;
import com.tododia.Ingles.repository.LessonSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageService {

    private final ImageRepository imageRepository;
    private final LessonSectionRepository lessonSectionRepository;
    private final ImageMapper mapper;

    public ImageResponse create(ImageRequest request) {

        LessonSection lessonSection = lessonSectionRepository
                .findById(request.getLessonSectionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seção da lição não encontrada."
                        ));

        Image image = mapper.toEntity(request);

        image.setLessonSection(lessonSection);

        Image saved = imageRepository.save(image);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ImageResponse> findAll() {

        return mapper.toResponseList(
                imageRepository.findAll()
        );
    }

    @Transactional(readOnly = true)
    public ImageResponse findById(Long id) {

        Image image = imageRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Imagem não encontrada."
                        ));

        return mapper.toResponse(image);
    }

    @Transactional(readOnly = true)
    public List<ImageResponse> findBySection(Long lessonSectionId) {

        if (!lessonSectionRepository.existsById(lessonSectionId)) {
            throw new ResourceNotFoundException(
                    "Seção da lição não encontrada."
            );
        }

        return mapper.toResponseList(
                imageRepository.findByLessonSectionId(lessonSectionId)
        );
    }

    public ImageResponse update(
            Long id,
            ImageRequest request) {

        Image image = imageRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Imagem não encontrada."
                        ));

        LessonSection lessonSection = lessonSectionRepository
                .findById(request.getLessonSectionId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seção da lição não encontrada."
                        ));

        image.setUrl(request.getUrl());
        image.setDescription(request.getDescription());
        image.setAltText(request.getAltText());
        image.setLessonSection(lessonSection);

        Image updated = imageRepository.save(image);

        return mapper.toResponse(updated);
    }

    public void delete(Long id) {

        if (!imageRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Imagem não encontrada."
            );
        }

        imageRepository.deleteById(id);
    }
}
