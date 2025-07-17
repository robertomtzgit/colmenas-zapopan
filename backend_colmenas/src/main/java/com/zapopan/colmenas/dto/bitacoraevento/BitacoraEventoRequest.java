package com.zapopan.colmenas.dto.bitacoraevento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BitacoraEventoRequest {
    @NotBlank(message = "La acción no puede estar vacía")
    @Size(max = 100, message = "La acción no puede exceder los 100 caracteres")
    private String accion;

    @Size(max = 100, message = "El módulo no puede exceder los 100 caracteres")
    private String modulo;

    @Size(max = 100, message = "La entidad no puede exceder los 100 caracteres")
    private String entidad;

    private Integer entidadId;

    private String descripcion;

    private Integer usuarioId; // Optional, can be null

    @Size(max = 45, message = "La IP no puede exceder los 45 caracteres")
    private String ip;

    private String datosAdicionales; // Expecting a JSON string
}
