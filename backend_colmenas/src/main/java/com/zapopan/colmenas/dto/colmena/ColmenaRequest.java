package com.zapopan.colmenas.dto.colmena;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColmenaRequest {
    @NotBlank(message = "El nombre de la colmena no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;

    @Size(max = 200, message = "La dirección no puede exceder los 200 caracteres")
    private String direccion;

    @Size(max = 100, message = "La colonia no puede exceder los 100 caracteres")
    private String colonia;

    @Size(max = 10, message = "El código postal no puede exceder los 10 caracteres")
    private String codigoPostal;

    private Double latitud;
    private Double longitud;

    @Size(max = 20, message = "El teléfono no puede exceder los 20 caracteres")
    private String telefono;

    @Size(max = 200, message = "La URL de la imagen no puede exceder los 200 caracteres")
    private String imagenUrl;

    private Integer responsableId; // Optional, can be null

    private Boolean activa;
}
