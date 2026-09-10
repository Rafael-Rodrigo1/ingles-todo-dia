package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.ExerciseRequest;
import com.tododia.Ingles.dto.response.ExerciseResponse;
import com.tododia.Ingles.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @PostMapping
    public ResponseEntity<ExerciseResponse> create(
            @Valid @RequestBody ExerciseRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(exerciseService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ExerciseResponse>> findAll() {
        return ResponseEntity.ok(exerciseService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(exerciseService.findById(id));
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<ExerciseResponse>> findByLesson(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                exerciseService.findByLesson(lessonId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ExerciseRequest request) {

        return ResponseEntity.ok(
                exerciseService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        exerciseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
