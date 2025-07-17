package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteRequest;
import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteResponse;

import java.util.List;

public interface CategoriaReporteService {
    List<CategoriaReporteResponse> getAllCategoriasReporte();
    CategoriaReporteResponse getCategoriaReporteById(Integer id);
    CategoriaReporteResponse createCategoriaReporte(CategoriaReporteRequest categoriaReporteRequest);
    CategoriaReporteResponse updateCategoriaReporte(Integer id, CategoriaReporteRequest categoriaReporteRequest);
    void deleteCategoriaReporte(Integer id);
}
