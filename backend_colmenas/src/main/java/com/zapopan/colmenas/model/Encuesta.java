package com.zapopan.colmenas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "encuestas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Encuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "preguntas_json", nullable = false, columnDefinition = "JSON")
    private String preguntasJson; // Storing JSON as String

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean activa;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean anonima;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creado_por_id")
    private Usuario creadoPor;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        if (activa == null) {
            activa = true;
        }
        if (anonima == null) {
            anonima = false;
        }
    }
}

