package com.zapopan.colmenas.dto.categoriareporte;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaReporteResponse {
    private Integer id;
    private String nombre;
    private String descripcion;
}
