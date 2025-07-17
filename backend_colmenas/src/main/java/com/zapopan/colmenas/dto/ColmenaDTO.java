package com.zapopan.colmenas.dto;

import lombok.Data;

@Data
public class ColmenaDTO {
    private Long id;
    private String nombre;
    private String direccion;
    private String colonia;
    private String codigoPostal;
    private double latitud;
    private double longitud;
    private String telefono;
    private boolean activa;
}
