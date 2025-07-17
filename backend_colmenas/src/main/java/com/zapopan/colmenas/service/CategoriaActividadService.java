package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadRequest;
import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadResponse;

import java.util.List;

public interface CategoriaActividadService {
    List<CategoriaActividadResponse> getAllCategoriasActividad();
    CategoriaActividadResponse getCategoriaActividadById(Integer id);
    CategoriaActividadResponse createCategoriaActividad(CategoriaActividadRequest categoriaActividadRequest);
    CategoriaActividadResponse updateCategoriaActividad(Integer id, CategoriaActividadRequest categoriaActividadRequest);
    void deleteCategoriaActividad(Integer id);
}
