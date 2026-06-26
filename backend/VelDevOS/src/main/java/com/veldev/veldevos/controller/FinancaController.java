package com.veldev.veldevos.controller;

import com.veldev.veldevos.dto.FinancaDTO;
import com.veldev.veldevos.model.Financa;
import com.veldev.veldevos.service.FinancaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financas")
@RequiredArgsConstructor
public class FinancaController {

    private final FinancaService financaService;

    @GetMapping
    public List<Financa> listar() {
        return financaService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Financa> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(financaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Financa> criar(@RequestBody FinancaDTO dto) {
        return ResponseEntity.ok(financaService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Financa> atualizar(@PathVariable Long id, @RequestBody FinancaDTO dto) {
        return ResponseEntity.ok(financaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        financaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
