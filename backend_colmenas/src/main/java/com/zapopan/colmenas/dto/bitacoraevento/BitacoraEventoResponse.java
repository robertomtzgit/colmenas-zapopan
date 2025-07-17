package com.zapopan.colmenas.dto.bitacoraevento;

import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BitacoraEventoResponse {
    private Integer id;
    private String accion;
    private String modulo;
    private String entidad;
    private Integer entidadId;
    private String descripcion;
    private UsuarioResponse usuario;
    private String ip;
    private LocalDateTime fechaEvento;
    private String datosAdicionales;
}
