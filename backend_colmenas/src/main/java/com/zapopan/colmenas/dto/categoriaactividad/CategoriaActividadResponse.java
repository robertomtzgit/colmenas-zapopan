package com.zapopan.colmenas.dto.categoriaactividad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaActividadResponse {
    private Integer id;
    private String nombre;
    private String descripcion;
    private String color;
    private String icono;
    private Boolean activa;
}
