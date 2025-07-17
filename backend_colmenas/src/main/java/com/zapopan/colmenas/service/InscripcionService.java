package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.inscripcion.InscripcionRequest;
import com.zapopan.colmenas.dto.inscripcion.InscripcionResponse;

import java.util.List;

public interface InscripcionService {
    List<InscripcionResponse> getAllInscripciones();
    InscripcionResponse getInscripcionById(Integer id);
    InscripcionResponse createInscripcion(InscripcionRequest inscripcionRequest);
    void deleteInscripcion(Integer id);
    List<InscripcionResponse> getInscripcionesByUsuarioId(Integer usuarioId);
    List<InscripcionResponse> getInscripcionesByActividadId(Integer actividadId);
}
