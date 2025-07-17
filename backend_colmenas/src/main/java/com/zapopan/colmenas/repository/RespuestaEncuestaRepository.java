package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.RespuestaEncuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RespuestaEncuestaRepository extends JpaRepository<RespuestaEncuesta, Integer> {
    List<RespuestaEncuesta> findByEncuestaId(Integer encuestaId);
    List<RespuestaEncuesta> findByUsuarioId(Integer usuarioId);
}

