package com.zapopan.colmenas.dto.usuario;

import com.zapopan.colmenas.model.enums.EstatusUsuario;
import com.zapopan.colmenas.model.enums.Sexo;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {
    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String nombre;

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El email debe ser válido")
    @Size(max = 150, message = "El email no puede exceder los 150 caracteres")
    private String email;

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password; // Optional for update, required for create

    @Min(value = 0, message = "La edad no puede ser negativa")
    private Integer edad;

    private Sexo sexo;

    @Size(max = 255, message = "El domicilio no puede exceder los 255 caracteres")
    private String domicilio;

    @Size(max = 20, message = "El teléfono no puede exceder los 20 caracteres")
    private String telefono;

    private EstatusUsuario estatus; // Añadido el campo estatus

    @NotNull(message = "El ID del rol no puede ser nulo")
    private Integer rolId;
}
