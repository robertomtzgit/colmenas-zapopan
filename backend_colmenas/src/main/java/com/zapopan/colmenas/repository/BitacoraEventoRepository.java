package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.BitacoraEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BitacoraEventoRepository extends JpaRepository<BitacoraEvento, Integer> {
    List<BitacoraEvento> findByUsuarioId(Integer usuarioId);
    List<BitacoraEvento> findByModulo(String modulo);
    List<BitacoraEvento> findByEntidadAndEntidadId(String entidad, Integer entidadId);
}

