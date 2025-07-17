package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.reporte.ReporteRequest;
import com.zapopan.colmenas.dto.reporte.ReporteResponse;
import com.zapopan.colmenas.model.enums.EstadoReporte;
import com.zapopan.colmenas.model.enums.PrioridadReporte;

import java.util.List;

public interface ReporteService {
    List<ReporteResponse> getAllReportes();
    ReporteResponse getReporteById(Integer id);
    ReporteResponse createReporte(ReporteRequest reporteRequest);
    ReporteResponse updateReporte(Integer id, ReporteRequest reporteRequest);
    void deleteReporte(Integer id);
    List<ReporteResponse> getReportesByEstado(EstadoReporte estado);
    List<ReporteResponse> getReportesByPrioridad(PrioridadReporte prioridad);
    List<ReporteResponse> getReportesByUsuarioId(Integer usuarioId);
}
