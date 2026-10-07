package com.tododia.Ingles.controller;

import com.tododia.Ingles.dto.request.UpdateUserEnabledRequest;
import com.tododia.Ingles.dto.request.UpdateUserRoleRequest;
import com.tododia.Ingles.dto.response.AdminUserResponse;
import com.tododia.Ingles.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService service;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> findAll() {

        return ResponseEntity.ok(
                service.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponse> findById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    @PatchMapping("/{id}/enabled")
    public ResponseEntity<AdminUserResponse> updateEnabled(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserEnabledRequest request
    ) {

        return ResponseEntity.ok(
                service.updateEnabled(id, request)
        );
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<AdminUserResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {

        return ResponseEntity.ok(
                service.updateRole(id, request)
        );
    }
}
