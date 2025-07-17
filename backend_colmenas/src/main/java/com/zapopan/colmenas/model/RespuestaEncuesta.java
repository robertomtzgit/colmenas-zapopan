package com.zapopan.colmenas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "respuestas_encuesta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespuestaEncuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encuesta_id", nullable = false)
    private Encuesta encuesta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // Can be null if survey is anonymous

    @Column(name = "respuestas_json", nullable = false, columnDefinition = "JSON")
    private String respuestasJson; // Storing JSON as String

    @Column(name = "fecha_respuesta", nullable = false, updatable = false)
    private LocalDateTime fechaRespuesta;

    @PrePersist
    protected void onCreate() {
        fechaRespuesta = LocalDateTime.now();
    }
}

