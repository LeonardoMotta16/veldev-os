package com.veldev.veldevos.service;

import com.veldev.veldevos.dto.FinancaDTO;
import com.veldev.veldevos.model.Financa;
import com.veldev.veldevos.model.Projeto;
import com.veldev.veldevos.repository.FinancaRepository;
import com.veldev.veldevos.repository.ProjetoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancaService {

    private final FinancaRepository financaRepository;
    private final ProjetoRepository projetoRepository;

    public List<Financa> listar() {
        return financaRepository.findAll();
    }

    public Financa buscarPorId(Long id) {
        return financaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Finança não encontrada"));
    }

    public Financa criar(FinancaDTO dto) {
        Financa financa = new Financa();
        financa.setDescricao(dto.getDescricao());
        financa.setTipo(dto.getTipo());
        financa.setValor(dto.getValor());
        financa.setData(dto.getData());
        if (dto.getProjetoId() != null) {
            Projeto projeto = projetoRepository.findById(dto.getProjetoId())
                    .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
            financa.setProjeto(projeto);
        }
        return financaRepository.save(financa);
    }

    public Financa atualizar(Long id, FinancaDTO dto) {
        Financa financa = buscarPorId(id);
        financa.setDescricao(dto.getDescricao());
        financa.setTipo(dto.getTipo());
        financa.setValor(dto.getValor());
        financa.setData(dto.getData());
        if (dto.getProjetoId() != null) {
            Projeto projeto = projetoRepository.findById(dto.getProjetoId())
                    .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
            financa.setProjeto(projeto);
        }
        return financaRepository.save(financa);
    }

    public void deletar(Long id) {
        financaRepository.deleteById(id);
    }
}
