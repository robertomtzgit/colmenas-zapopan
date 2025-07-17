package com.zapopan.colmenas.dto.encuesta;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncuestaRequest {
    @NotBlank(message = "El título no puede estar vacío")
    @Size(max = 200, message = "El título no puede exceder los 200 caracteres")
    private String titulo;

    private String descripcion;

    @NotBlank(message = "Las preguntas no pueden estar vacías (formato JSON)")
    private String preguntasJson; // Expecting a JSON string

    @NotNull(message = "La fecha de inicio no puede ser nula")
    @FutureOrPresent(message = "La fecha de inicio debe ser en el presente o futuro")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin no puede ser nula")
    @FutureOrPresent(message = "La fecha de fin debe ser en el presente o futuro")
    private LocalDateTime fechaFin;

    private Boolean activa;

    private Boolean anonima;

    private Integer creadoPorId; // Optional, can be null
}
