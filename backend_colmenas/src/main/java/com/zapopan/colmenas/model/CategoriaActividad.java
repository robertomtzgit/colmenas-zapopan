package com.zapopan.colmenas.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias_actividad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaActividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 20, columnDefinition = "VARCHAR(20) DEFAULT '#3B82F6'")
    private String color;

    @Column(length = 50)
    private String icono;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean activa;

    @PrePersist
    protected void onCreate() {
        if (color == null) {
            color = "#3B82F6";
        }
        if (activa == null) {
            activa = true;
        }
    }
}
