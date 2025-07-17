package com.zapopan.colmenas.model;

import java.time.LocalDateTime;

import com.zapopan.colmenas.model.enums.EstatusUsuario;
import com.zapopan.colmenas.model.enums.Sexo;

import jakarta.persistence.*;
import lombok.*; 

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder 
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column
    private Integer edad;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('masculino', 'femenino', 'otro') DEFAULT 'otro'")
    private Sexo sexo;

    @Column(length = 255)
    private String domicilio;

    @Column(length = 20)
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('activo', 'inactivo', 'suspendido') DEFAULT 'activo'")
    private EstatusUsuario estatus;

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id") // Aseguramos onDelete SET NULL
    private Role rol;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        if (estatus == null) {
            estatus = EstatusUsuario.activo;
        }
        if (sexo == null) {
            sexo = Sexo.otro;
        }
    }
}
