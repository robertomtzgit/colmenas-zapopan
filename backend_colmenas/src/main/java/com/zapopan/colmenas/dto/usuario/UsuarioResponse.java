package com.zapopan.colmenas.dto.usuario;

import com.zapopan.colmenas.dto.role.RoleResponse;
import com.zapopan.colmenas.model.enums.EstatusUsuario;
import com.zapopan.colmenas.model.enums.Sexo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Integer id;
    private String nombre;
    private String email;
    private Integer edad;
    private Sexo sexo;
    private String domicilio;
    private String telefono;
    private EstatusUsuario estatus;
    private LocalDateTime ultimoLogin;
    private RoleResponse rol;
    private LocalDateTime creadoEn;
}
