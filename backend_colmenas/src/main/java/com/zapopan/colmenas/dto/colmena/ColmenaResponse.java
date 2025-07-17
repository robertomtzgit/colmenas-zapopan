package com.zapopan.colmenas.dto.colmena;

import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColmenaResponse {
    private Integer id;
    private String nombre;
    private String direccion;
    private String colonia;
    private String codigoPostal;
    private Double latitud;
    private Double longitud;
    private String telefono;
    private String imagenUrl;
    private UsuarioResponse responsable;
    private Boolean activa;
}
