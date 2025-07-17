package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.Encuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EncuestaRepository extends JpaRepository<Encuesta, Integer> {
    List<Encuesta> findByActivaTrue();
}

