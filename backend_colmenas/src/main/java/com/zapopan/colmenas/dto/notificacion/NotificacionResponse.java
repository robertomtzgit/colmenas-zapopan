package com.zapopan.colmenas.dto.notificacion;

import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionResponse {
    private Integer id;
    private String titulo;
    private String mensaje;
    private String tipo;
    private UsuarioResponse usuario;
    private ColmenaResponse colmena;
    private UsuarioResponse creadoPor;
    private Boolean leida;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaLeida;
}
