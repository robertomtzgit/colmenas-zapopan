package com.zapopan.colmenas.dto.reporte;

import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteResponse;
import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.model.enums.EstadoReporte;
import com.zapopan.colmenas.model.enums.PrioridadReporte;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteResponse {
    private Integer id;
    private String titulo;
    private String descripcion;
    private CategoriaReporteResponse categoria;
    private EstadoReporte estado;
    private PrioridadReporte prioridad;
    private String ubicacion;
    private Double latitud;
    private Double longitud;
    private String imagenUrl;
    private UsuarioResponse usuario;
    private ColmenaResponse colmena;
    private UsuarioResponse asignadoA;
    private String comentarioResolucion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaResolucion;
}
