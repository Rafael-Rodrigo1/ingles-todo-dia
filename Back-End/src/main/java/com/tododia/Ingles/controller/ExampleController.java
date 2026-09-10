package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.ExampleRequest;
import com.tododia.Ingles.dto.response.ExampleResponse;
import com.tododia.Ingles.service.ExampleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examples")
@RequiredArgsConstructor
public class ExampleController {

    private final ExampleService exampleService;

    @PostMapping
    public ResponseEntity<ExampleResponse> create(
            @Valid @RequestBody ExampleRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(exampleService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ExampleResponse>> findAll() {

        return ResponseEntity.ok(
                exampleService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExampleResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                exampleService.findById(id)
        );
    }

    @GetMapping("/section/{lessonSectionId}")
    public ResponseEntity<List<ExampleResponse>> findBySection(
            @PathVariable Long lessonSectionId) {

        return ResponseEntity.ok(
                exampleService.findBySection(lessonSectionId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExampleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ExampleRequest request) {

        return ResponseEntity.ok(
                exampleService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        exampleService.delete(id);

        return ResponseEntity.noContent().build();
    }
}