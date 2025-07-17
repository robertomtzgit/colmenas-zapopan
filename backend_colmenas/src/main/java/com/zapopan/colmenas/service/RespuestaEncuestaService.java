package com.zapopan.colmenas.service;

import com.zapopan.colmenas.dto.respuestaencuesta.RespuestaEncuestaRequest;
import com.zapopan.colmenas.dto.respuestaencuesta.RespuestaEncuestaResponse;

import java.util.List;

public interface RespuestaEncuestaService {
    List<RespuestaEncuestaResponse> getAllRespuestasEncuesta();
    RespuestaEncuestaResponse getRespuestaEncuestaById(Integer id);
    RespuestaEncuestaResponse createRespuestaEncuesta(RespuestaEncuestaRequest respuestaEncuestaRequest);
    void deleteRespuestaEncuesta(Integer id);
    List<RespuestaEncuestaResponse> getRespuestasByEncuestaId(Integer encuestaId);
    List<RespuestaEncuestaResponse> getRespuestasByUsuarioId(Integer usuarioId);
}
