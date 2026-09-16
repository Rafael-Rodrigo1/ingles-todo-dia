package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.UserExerciseProgressRequest;
import com.tododia.Ingles.dto.response.UserExerciseProgressResponse;
import com.tododia.Ingles.service.UserExerciseProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercise-progress")
@RequiredArgsConstructor
public class UserExerciseProgressController {

    private final UserExerciseProgressService service;

    @PutMapping
    public ResponseEntity<UserExerciseProgressResponse> saveProgress(
            @Valid @RequestBody UserExerciseProgressRequest request) {

        return ResponseEntity.ok(
                service.saveProgress(request)
        );
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<UserExerciseProgressResponse>> findByLesson(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                service.findByLesson(lessonId)
        );
    }

    @GetMapping("/exercise/{exerciseId}")
    public ResponseEntity<UserExerciseProgressResponse> findByExercise(
            @PathVariable Long exerciseId) {

        return ResponseEntity.ok(
                service.findByExercise(exerciseId)
        );
    }
}