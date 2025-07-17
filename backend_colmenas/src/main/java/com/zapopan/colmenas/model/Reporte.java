package com.zapopan.colmenas.model;

import com.zapopan.colmenas.model.enums.EstadoReporte;
import com.zapopan.colmenas.model.enums.PrioridadReporte;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reportes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaReporte categoria;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('pendiente', 'en_proceso', 'resuelto') DEFAULT 'pendiente'")
    private EstadoReporte estado;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('alta', 'media', 'baja') DEFAULT 'media'")
    private PrioridadReporte prioridad;

    @Column(length = 200)
    private String ubicacion;

    private Double latitud;
    private Double longitud;

    @Column(name = "imagen_url", length = 200)
    private String imagenUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colmena_id")
    private Colmena colmena;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignado_a_id")
    private Usuario asignadoA;

    @Column(name = "comentario_resolucion", columnDefinition = "TEXT")
    private String comentarioResolucion;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (estado == null) {
            estado = EstadoReporte.pendiente;
        }
        if (prioridad == null) {
            prioridad = PrioridadReporte.media;
        }
    }
}

