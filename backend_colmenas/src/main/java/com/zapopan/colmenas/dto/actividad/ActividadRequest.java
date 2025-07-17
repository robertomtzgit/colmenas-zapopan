package com.zapopan.colmenas.dto.actividad;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
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
public class ActividadRequest {
    @NotBlank(message = "El título no puede estar vacío")
    @Size(max = 150, message = "El título no puede exceder los 150 caracteres")
    private String titulo;

    private String descripcion;

    @NotNull(message = "La fecha de inicio no puede ser nula")
    @FutureOrPresent(message = "La fecha de inicio debe ser en el presente o futuro")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin no puede ser nula")
    @FutureOrPresent(message = "La fecha de fin debe ser en el presente o futuro")
    private LocalDateTime fechaFin;

    @Size(max = 150, message = "La ubicación no puede exceder los 150 caracteres")
    private String ubicacion;

    @Min(value = 0, message = "La capacidad máxima no puede ser negativa")
    private Integer capacidadMaxima;

    private Integer colmenaId; // Optional, can be null

    private Integer categoriaId; // Optional, can be null

    private Integer creadoPorId; // Optional, can be null

    @Size(max = 200, message = "La URL de la imagen no puede exceder los 200 caracteres")
    private String imagenUrl;

    private Boolean activa;
}

