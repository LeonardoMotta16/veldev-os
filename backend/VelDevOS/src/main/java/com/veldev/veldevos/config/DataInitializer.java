package com.veldev.veldevos.config;

import com.veldev.veldevos.model.Usuario;
import com.veldev.veldevos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (usuarioRepository.findByEmail("admin@veldev.com").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNome("Admin");
                admin.setEmail("admin@veldev.com");
                admin.setSenha(passwordEncoder.encode("admin123"));
                usuarioRepository.save(admin);
                System.out.println("Usuário admin criado com sucesso!");
            }
        };
    }
}
