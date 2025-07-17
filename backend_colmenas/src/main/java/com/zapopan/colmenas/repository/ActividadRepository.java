package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Integer> {
    List<Actividad> findByColmenaId(Integer colmenaId);
    List<Actividad> findByFechaInicioBetween(LocalDateTime start, LocalDateTime end);
    List<Actividad> findByActivaTrue();
}

