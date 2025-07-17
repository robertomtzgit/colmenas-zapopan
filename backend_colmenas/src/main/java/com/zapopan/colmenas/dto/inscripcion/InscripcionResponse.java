package com.zapopan.colmenas.dto.inscripcion;

import com.zapopan.colmenas.dto.actividad.ActividadResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscripcionResponse {
    private Integer id;
    private ActividadResponse actividad;
    private UsuarioResponse usuario;
    private LocalDateTime fechaInscripcion;
}
