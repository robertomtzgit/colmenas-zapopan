package com.zapopan.colmenas.dto.actividad;

import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadResponse;
import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActividadResponse {
    private Integer id;
    private String titulo;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String ubicacion;
    private Integer capacidadMaxima;
    private ColmenaResponse colmena;
    private CategoriaActividadResponse categoria;
    private UsuarioResponse creadoPor;
    private String imagenUrl;
    private Boolean activa;
    private LocalDateTime creadoEn;
}

