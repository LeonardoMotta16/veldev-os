package com.veldev.veldevos.repository;

import com.veldev.veldevos.model.Financa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FinancaRepository extends JpaRepository<Financa, Long> {
    List<Financa> findByProjetoId(Long projetoId);
}
