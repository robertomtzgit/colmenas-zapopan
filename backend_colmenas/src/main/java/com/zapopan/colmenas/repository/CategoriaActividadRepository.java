package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.CategoriaActividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaActividadRepository extends JpaRepository<CategoriaActividad, Integer> {
    List<CategoriaActividad> findByActivaTrue();
}

