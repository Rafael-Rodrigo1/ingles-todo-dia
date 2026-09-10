package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.FinishStudySessionRequest;
import com.tododia.Ingles.dto.request.StudySessionRequest;
import com.tododia.Ingles.dto.response.StudySessionResponse;
import com.tododia.Ingles.service.StudySessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-sessions")
@RequiredArgsConstructor
public class StudySessionController {

    private final StudySessionService service;

    @PostMapping("/start")
    public ResponseEntity<StudySessionResponse> start(
            @Valid @RequestBody StudySessionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.start(request));
    }

    @PutMapping("/{id}/finish")
    public ResponseEntity<StudySessionResponse> finish(
            @PathVariable Long id,
            @Valid @RequestBody FinishStudySessionRequest request) {

        return ResponseEntity.ok(
                service.finish(id, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<StudySessionResponse>> findMySessions() {

        return ResponseEntity.ok(
                service.findMySessions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudySessionResponse> findMySessionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findMySessionById(id)
        );
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<StudySessionResponse>> findMySessionsByLesson(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                service.findMySessionsByLesson(lessonId)
        );
    }
}