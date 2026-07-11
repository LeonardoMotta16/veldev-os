package com.veldev.veldevos.controller;

import com.veldev.veldevos.dto.LoginRequestDTO;
import com.veldev.veldevos.dto.LoginResponseDTO;
import com.veldev.veldevos.dto.RegisterRequestDTO;
import com.veldev.veldevos.model.Usuario;
import com.veldev.veldevos.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${veldev.admin-key}")
    private String adminKey;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequestDTO dto,
            @RequestHeader("X-Admin-Key") String requestKey) {

        if (!adminKey.equals(requestKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Chave de acesso inválida");
        }

        return ResponseEntity.ok(authService.register(dto));
    }
}