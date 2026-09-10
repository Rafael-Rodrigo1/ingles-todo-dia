package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.LessonRequest;
import com.tododia.Ingles.dto.response.LessonResponse;
import com.tododia.Ingles.service.LessonService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class LessonController {

    private final LessonService lessonService;

    @PostMapping
    public ResponseEntity<LessonResponse> create(
            @Valid @RequestBody LessonRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lessonService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<LessonResponse>> findAll() {

        return ResponseEntity.ok(lessonService.findAll());
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        return ResponseEntity.ok(authentication.getAuthorities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(lessonService.findById(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<LessonResponse>> findByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                lessonService.findByCategory(categoryId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody LessonRequest request) {

        return ResponseEntity.ok(
                lessonService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        lessonService.delete(id);

        return ResponseEntity.noContent().build();
    }
}