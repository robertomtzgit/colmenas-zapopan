package com.zapopan.colmenas.dto.inscripcion;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscripcionRequest {
    @NotNull(message = "El ID de la actividad no puede ser nulo")
    private Integer actividadId;

    @NotNull(message = "El ID del usuario no puede ser nulo")
    private Integer usuarioId;
}
