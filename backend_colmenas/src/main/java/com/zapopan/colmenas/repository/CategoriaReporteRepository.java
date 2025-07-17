package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.CategoriaReporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaReporteRepository extends JpaRepository<CategoriaReporte, Integer> {
}

