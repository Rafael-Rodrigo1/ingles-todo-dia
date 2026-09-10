package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.LessonSectionRequest;
import com.tododia.Ingles.dto.response.LessonSectionResponse;
import com.tododia.Ingles.service.LessonSectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson-sections")
@RequiredArgsConstructor
public class LessonSectionController {

    private final LessonSectionService lessonSectionService;

    @PostMapping
    public ResponseEntity<LessonSectionResponse> create(
            @Valid @RequestBody LessonSectionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(lessonSectionService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<LessonSectionResponse>> findAll() {

        return ResponseEntity.ok(
                lessonSectionService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonSectionResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                lessonSectionService.findById(id)
        );
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<LessonSectionResponse>> findByLesson(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                lessonSectionService.findByLesson(lessonId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonSectionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody LessonSectionRequest request) {

        return ResponseEntity.ok(
                lessonSectionService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        lessonSectionService.delete(id);

        return ResponseEntity.noContent().build();
    }
}