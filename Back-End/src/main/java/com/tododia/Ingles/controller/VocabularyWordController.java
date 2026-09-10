package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.VocabularyWordRequest;
import com.tododia.Ingles.dto.response.VocabularyWordResponse;
import com.tododia.Ingles.service.VocabularyWordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary-words")
@RequiredArgsConstructor
public class VocabularyWordController {

    private final VocabularyWordService service;

    @PostMapping
    public ResponseEntity<VocabularyWordResponse> create(
            @Valid @RequestBody VocabularyWordRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<VocabularyWordResponse>> findAll() {

        return ResponseEntity.ok(
                service.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<VocabularyWordResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<VocabularyWordResponse>> findByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                service.findByCategory(categoryId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<VocabularyWordResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody VocabularyWordRequest request) {

        return ResponseEntity.ok(
                service.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}