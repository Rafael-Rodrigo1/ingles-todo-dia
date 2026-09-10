package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.UserProgressRequest;
import com.tododia.Ingles.dto.response.UserProgressResponse;
import com.tododia.Ingles.service.UserProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService service;

    @PutMapping
    public ResponseEntity<UserProgressResponse> saveProgress(
            @Valid @RequestBody UserProgressRequest request) {

        return ResponseEntity.ok(
                service.saveProgress(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<UserProgressResponse>> findMyProgress() {

        return ResponseEntity.ok(
                service.findMyProgress()
        );
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<UserProgressResponse> findMyProgressByLesson(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                service.findMyProgressByLesson(lessonId)
        );
    }
}
