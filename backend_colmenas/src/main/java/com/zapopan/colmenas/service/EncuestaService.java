package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.encuesta.EncuestaRequest;
import com.zapopan.colmenas.dto.encuesta.EncuestaResponse;

import java.util.List;

public interface EncuestaService {
    List<EncuestaResponse> getAllEncuestas();
    EncuestaResponse getEncuestaById(Integer id);
    EncuestaResponse createEncuesta(EncuestaRequest encuestaRequest);
    EncuestaResponse updateEncuesta(Integer id, EncuestaRequest encuestaRequest);
    void deleteEncuesta(Integer id);
}
