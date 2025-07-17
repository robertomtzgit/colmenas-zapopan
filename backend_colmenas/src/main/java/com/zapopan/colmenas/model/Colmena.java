package com.zapopan.colmenas.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "colmenas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Colmena {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 200)
    private String direccion;

    @Column(length = 100)
    private String colonia;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    private Double latitud;
    private Double longitud;

    @Column(length = 20)
    private String telefono;

    @Column(name = "imagen_url", length = 200)
    private String imagenUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id")
    private Usuario responsable;

    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean activa;

    @PrePersist
    protected void onCreate() {
        if (activa == null) {
            activa = true;
        }
    }
}
