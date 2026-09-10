package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.QuestionRequest;
import com.tododia.Ingles.dto.response.QuestionResponse;
import com.tododia.Ingles.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponse> create(
            @Valid @RequestBody QuestionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(questionService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponse>> findAll() {
        return ResponseEntity.ok(questionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(questionService.findById(id));
    }

    @GetMapping("/exercise/{exerciseId}")
    public ResponseEntity<List<QuestionResponse>> findByExercise(
            @PathVariable Long exerciseId) {

        return ResponseEntity.ok(
                questionService.findByExercise(exerciseId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request) {

        return ResponseEntity.ok(
                questionService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        questionService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
