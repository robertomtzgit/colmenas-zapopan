package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.Reporte;
import com.zapopan.colmenas.model.enums.EstadoReporte;
import com.zapopan.colmenas.model.enums.PrioridadReporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Integer> {
    List<Reporte> findByEstado(EstadoReporte estado);
    List<Reporte> findByPrioridad(PrioridadReporte prioridad);
    List<Reporte> findByUsuarioId(Integer usuarioId);
    List<Reporte> findByColmenaId(Integer colmenaId);
    List<Reporte> findByAsignadoAId(Integer asignadoAId);
}

