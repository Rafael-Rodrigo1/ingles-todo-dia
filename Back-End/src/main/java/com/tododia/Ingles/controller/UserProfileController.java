package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.ChangePasswordRequest;
import com.tododia.Ingles.dto.request.UpdateUserProfileRequest;
import com.tododia.Ingles.dto.response.UserProfileResponse;
import com.tododia.Ingles.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService service;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getMyProfile() {

        return ResponseEntity.ok(
                service.getMyProfile()
        );
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateUserProfileRequest request) {

        return ResponseEntity.ok(
                service.updateMyProfile(request)
        );
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        service.changePassword(request);

        return ResponseEntity.noContent().build();
    }
}