package com.veldev.veldevos.service;

import com.veldev.veldevos.dto.ProjetoDTO;
import com.veldev.veldevos.model.Cliente;
import com.veldev.veldevos.model.Projeto;
import com.veldev.veldevos.repository.ClienteRepository;
import com.veldev.veldevos.repository.ProjetoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetoService {

    private final ProjetoRepository projetoRepository;
    private final ClienteRepository clienteRepository;

    public List<Projeto> listar() {
        return projetoRepository.findAll();
    }

    public Projeto buscarPorId(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
    }

    public Projeto criar(ProjetoDTO dto) {
        Projeto projeto = new Projeto();
        projeto.setNome(dto.getNome());
        projeto.setDescricao(dto.getDescricao());
        projeto.setStatus(dto.getStatus());
        projeto.setValor(dto.getValor());
        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            projeto.setCliente(cliente);
        }
        return projetoRepository.save(projeto);
    }

    public Projeto atualizar(Long id, ProjetoDTO dto) {
        Projeto projeto = buscarPorId(id);
        projeto.setNome(dto.getNome());
        projeto.setDescricao(dto.getDescricao());
        projeto.setStatus(dto.getStatus());
        projeto.setValor(dto.getValor());
        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            projeto.setCliente(cliente);
        }
        return projetoRepository.save(projeto);
    }

    public void deletar(Long id) {
        projetoRepository.deleteById(id);
    }
}
