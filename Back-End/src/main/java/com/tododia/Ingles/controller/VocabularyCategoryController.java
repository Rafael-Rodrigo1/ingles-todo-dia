package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.VocabularyCategoryRequest;
import com.tododia.Ingles.dto.response.VocabularyCategoryResponse;
import com.tododia.Ingles.service.VocabularyCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary-categories")
@RequiredArgsConstructor
public class VocabularyCategoryController {

    private final VocabularyCategoryService service;

    @PostMapping
    public ResponseEntity<VocabularyCategoryResponse> create(
            @Valid @RequestBody VocabularyCategoryRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<VocabularyCategoryResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VocabularyCategoryResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(service.findById(id));
    }

    @GetMapping("/active")
    public ResponseEntity<List<VocabularyCategoryResponse>> findActive() {
        return ResponseEntity.ok(service.findActive());
    }

    @PutMapping("/{id}")
    public ResponseEntity<VocabularyCategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody VocabularyCategoryRequest request) {

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