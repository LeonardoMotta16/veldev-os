package com.veldev.veldevos.service;

import com.veldev.veldevos.dto.LoginRequestDTO;
import com.veldev.veldevos.dto.LoginResponseDTO;
import com.veldev.veldevos.dto.RegisterRequestDTO;
import com.veldev.veldevos.dto.UsuarioResponseDTO;
import com.veldev.veldevos.model.Usuario;
import com.veldev.veldevos.repository.UsuarioRepository;
import com.veldev.veldevos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        String token = jwtService.gerarToken(usuario.getEmail());
        return new LoginResponseDTO(token, usuario.getNome(), usuario.getEmail());
    }
    public UsuarioResponseDTO register(RegisterRequestDTO dto) {
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(dto.email());
        usuario.setSenha(passwordEncoder.encode(dto.senha()));
        Usuario salvo = usuarioRepository.save(usuario);

        return new UsuarioResponseDTO(salvo.getId(), salvo.getNome(), salvo.getEmail());
    }
}
