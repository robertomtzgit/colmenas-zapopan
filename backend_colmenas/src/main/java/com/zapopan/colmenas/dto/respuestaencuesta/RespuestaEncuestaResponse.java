package com.zapopan.colmenas.dto.respuestaencuesta;

import com.zapopan.colmenas.dto.encuesta.EncuestaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaEncuestaResponse {
    private Integer id;
    private EncuestaResponse encuesta;
    private UsuarioResponse usuario;
    private String respuestasJson;
    private LocalDateTime fechaRespuesta;
}
