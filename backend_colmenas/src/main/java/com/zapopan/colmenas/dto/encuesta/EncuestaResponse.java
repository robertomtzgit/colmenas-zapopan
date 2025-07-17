package com.zapopan.colmenas.dto.encuesta;

import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncuestaResponse {
    private Integer id;
    private String titulo;
    private String descripcion;
    private String preguntasJson;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Boolean activa;
    private Boolean anonima;
    private UsuarioResponse creadoPor;
    private LocalDateTime creadoEn;
}
