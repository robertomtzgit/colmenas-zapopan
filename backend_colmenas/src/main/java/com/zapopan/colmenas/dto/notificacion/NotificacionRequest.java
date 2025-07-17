package com.zapopan.colmenas.dto.notificacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionRequest {
    @NotBlank(message = "El título no puede estar vacío")
    @Size(max = 150, message = "El título no puede exceder los 150 caracteres")
    private String titulo;

    @NotBlank(message = "El mensaje no puede estar vacío")
    private String mensaje;

    @Size(max = 50, message = "El tipo no puede exceder los 50 caracteres")
    private String tipo;

    private Integer usuarioId; // Optional, can be null

    private Integer colmenaId; // Optional, can be null

    private Integer creadoPorId; // Optional, can be null

    private Boolean leida;

    private LocalDateTime fechaLeida;
}
