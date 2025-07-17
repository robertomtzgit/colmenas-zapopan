package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.actividad.ActividadRequest;
import com.zapopan.colmenas.dto.actividad.ActividadResponse;

import java.util.List;

public interface ActividadService {
    List<ActividadResponse> getAllActividades();
    ActividadResponse getActividadById(Integer id);
    ActividadResponse createActividad(ActividadRequest actividadRequest);
    ActividadResponse updateActividad(Integer id, ActividadRequest actividadRequest);
    void deleteActividad(Integer id);
}
