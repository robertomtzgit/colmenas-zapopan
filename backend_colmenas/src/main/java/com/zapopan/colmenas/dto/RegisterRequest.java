package com.zapopan.colmenas.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String email;
    private String password;
    private Integer edad;
    private String sexo; 
    private String domicilio;
    private String telefono;
    private String rol; 
}
