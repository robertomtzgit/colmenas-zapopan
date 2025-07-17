package com.zapopan.colmenas.dto.reporte;

import com.zapopan.colmenas.model.enums.EstadoReporte;
import com.zapopan.colmenas.model.enums.PrioridadReporte;
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
public class ReporteRequest {
    @NotBlank(message = "El título no puede estar vacío")
    @Size(max = 150, message = "El título no puede exceder los 150 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción no puede estar vacía")
    private String descripcion;

    @NotNull(message = "El ID de la categoría no puede ser nulo")
    private Integer categoriaId;

    private EstadoReporte estado;

    private PrioridadReporte prioridad;

    @Size(max = 200, message = "La ubicación no puede exceder los 200 caracteres")
    private String ubicacion;

    private Double latitud;
    private Double longitud;

    @Size(max = 200, message = "La URL de la imagen no puede exceder los 200 caracteres")
    private String imagenUrl;

    private Integer usuarioId; // Optional, can be null

    private Integer colmenaId; // Optional, can be null

    private Integer asignadoAId; // Optional, can be null

    private String comentarioResolucion;

    private LocalDateTime fechaResolucion;
}
