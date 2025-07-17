package com.zapopan.colmenas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "actividades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Column(length = 150)
    private String ubicacion;

    @Column(name = "capacidad_maxima", columnDefinition = "INT DEFAULT 0")
    private Integer capacidadMaxima; // CHECK (capacidad_maxima >= 0) - validation handled in DTO

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colmena_id")
    private Colmena colmena;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private CategoriaActividad categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creado_por_id")
    private Usuario creadoPor;

    @Column(name = "imagen_url", length = 200)
    private String imagenUrl;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean activa;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        if (capacidadMaxima == null) {
            capacidadMaxima = 0;
        }
        if (activa == null) {
            activa = true;
        }
    }
}
