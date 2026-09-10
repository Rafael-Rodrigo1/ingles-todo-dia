package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.TagRequest;
import com.tododia.Ingles.dto.response.TagResponse;
import com.tododia.Ingles.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService service;

    @PostMapping
    public ResponseEntity<TagResponse> create(
            @Valid @RequestBody TagRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> findAll() {

        return ResponseEntity.ok(
                service.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<TagResponse> findBySlug(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                service.findBySlug(slug)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody TagRequest request) {

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


