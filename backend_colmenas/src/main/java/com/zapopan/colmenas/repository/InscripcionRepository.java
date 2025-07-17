package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Integer> {
    Optional<Inscripcion> findByActividadIdAndUsuarioId(Integer actividadId, Integer usuarioId);
    List<Inscripcion> findByUsuarioId(Integer usuarioId);
    List<Inscripcion> findByActividadId(Integer actividadId);
}

