package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.AlternativeRequest;
import com.tododia.Ingles.dto.response.AlternativeResponse;
import com.tododia.Ingles.service.AlternativeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alternatives")
@RequiredArgsConstructor
public class AlternativeController {

    private final AlternativeService alternativeService;

    @PostMapping
    public ResponseEntity<AlternativeResponse> create(
            @Valid @RequestBody AlternativeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(alternativeService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<AlternativeResponse>> findAll() {
        return ResponseEntity.ok(alternativeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlternativeResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                alternativeService.findById(id)
        );
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<AlternativeResponse>> findByQuestion(
            @PathVariable Long questionId) {

        return ResponseEntity.ok(
                alternativeService.findByQuestion(questionId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlternativeResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AlternativeRequest request) {

        return ResponseEntity.ok(
                alternativeService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        alternativeService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
