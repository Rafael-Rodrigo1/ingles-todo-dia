package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.ImageRequest;
import com.tododia.Ingles.dto.response.ImageResponse;
import com.tododia.Ingles.service.ImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<ImageResponse> create(
            @Valid @RequestBody ImageRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(imageService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ImageResponse>> findAll() {
        return ResponseEntity.ok(imageService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(imageService.findById(id));
    }

    @GetMapping("/section/{lessonSectionId}")
    public ResponseEntity<List<ImageResponse>> findBySection(
            @PathVariable Long lessonSectionId) {

        return ResponseEntity.ok(
                imageService.findBySection(lessonSectionId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ImageRequest request) {

        return ResponseEntity.ok(
                imageService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        imageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
