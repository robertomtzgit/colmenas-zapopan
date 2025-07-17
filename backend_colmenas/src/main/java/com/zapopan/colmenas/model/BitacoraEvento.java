package com.zapopan.colmenas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora_eventos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BitacoraEvento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String accion;

    @Column(length = 100)
    private String modulo;

    @Column(length = 100)
    private String entidad;

    @Column(name = "entidad_id")
    private Integer entidadId;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(length = 45)
    private String ip;

    @Column(name = "fecha_evento", nullable = false, updatable = false)
    private LocalDateTime fechaEvento;

    @Column(name = "datos_adicionales", columnDefinition = "JSON")
    private String datosAdicionales; // Storing JSON as String

    @PrePersist
    protected void onCreate() {
        fechaEvento = LocalDateTime.now();
    }
}

    