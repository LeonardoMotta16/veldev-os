package com.veldev.veldevos.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProjetoDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String status;
    private BigDecimal valor;
    private Long clienteId;
}
