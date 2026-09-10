package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.AudioRequest;
import com.tododia.Ingles.dto.response.AudioResponse;
import com.tododia.Ingles.service.AudioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audios")
@RequiredArgsConstructor
public class AudioController {

    private final AudioService audioService;

    @PostMapping
    public ResponseEntity<AudioResponse> create(
            @Valid @RequestBody AudioRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(audioService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<AudioResponse>> findAll() {

        return ResponseEntity.ok(
                audioService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AudioResponse> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                audioService.findById(id)
        );
    }

    @GetMapping("/section/{lessonSectionId}")
    public ResponseEntity<List<AudioResponse>> findBySection(
            @PathVariable Long lessonSectionId) {

        return ResponseEntity.ok(
                audioService.findBySection(lessonSectionId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<AudioResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody AudioRequest request) {

        return ResponseEntity.ok(
                audioService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        audioService.delete(id);

        return ResponseEntity.noContent().build();
    }
}