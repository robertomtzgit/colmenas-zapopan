package com.zapopan.colmenas.dto.categoriaactividad;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaActividadRequest {
    @NotBlank(message = "El nombre de la categoría no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;

    private String descripcion;

    @Size(max = 20, message = "El color no puede exceder los 20 caracteres")
    private String color;

    @Size(max = 50, message = "El icono no puede exceder los 50 caracteres")
    private String icono;

    private Boolean activa;
}
