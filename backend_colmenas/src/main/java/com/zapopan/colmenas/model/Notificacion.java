package com.zapopan.colmenas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(length = 50, columnDefinition = "VARCHAR(50) DEFAULT 'general'")
    private String tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // Can be null for general notifications

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colmena_id")
    private Colmena colmena; // Can be null for general notifications

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creado_por_id")
    private Usuario creadoPor;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean leida;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_leida")
    private LocalDateTime fechaLeida;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (tipo == null) {
            tipo = "general";
        }
        if (leida == null) {
            leida = false;
        }
    }
}

