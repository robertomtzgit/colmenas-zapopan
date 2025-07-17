package com.zapopan.colmenas.dto.respuestaencuesta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaEncuestaRequest {
    @NotNull(message = "El ID de la encuesta no puede ser nulo")
    private Integer encuestaId;

    private Integer usuarioId; // Optional, can be null for anonymous surveys

    @NotBlank(message = "Las respuestas no pueden estar vacías (formato JSON)")
    private String respuestasJson; // Expecting a JSON string
}
