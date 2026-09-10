package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.response.FavoriteResponse;
import com.tododia.Ingles.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService service;

    @PostMapping("/{lessonId}")
    public ResponseEntity<FavoriteResponse> addFavorite(
            @PathVariable Long lessonId) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.addFavorite(lessonId));
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> findMyFavorites() {

        return ResponseEntity.ok(
                service.findMyFavorites()
        );
    }

    @GetMapping("/{lessonId}/check")
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                Map.of("favorite", service.isFavorite(lessonId))
        );
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long lessonId) {

        service.removeFavorite(lessonId);

        return ResponseEntity.noContent().build();
    }
}
