package com.veldev.veldevos.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FinancaDTO {
    private Long id;
    private String descricao;
    private String tipo;
    private BigDecimal valor;
    private LocalDate data;
    private Long projetoId;
}
