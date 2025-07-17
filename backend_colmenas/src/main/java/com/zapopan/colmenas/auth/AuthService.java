package com.zapopan.colmenas.auth;

import com.zapopan.colmenas.dto.auth.AuthResponse;
import com.zapopan.colmenas.dto.auth.LoginRequest;
import com.zapopan.colmenas.dto.auth.RegisterRequest;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Role;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.RoleRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }

        Role role = roleRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + request.getRolId()));

        Usuario user = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .edad(request.getEdad())
                .sexo(request.getSexo())
                .domicilio(request.getDomicilio())
                .telefono(request.getTelefono())
                .rol(role)
                .creadoEn(LocalDateTime.now())
                .build();

        usuarioRepository.save(user);

        return new AuthResponse("Registro exitoso", user.getId(), user.getEmail(), user.getRol().getNombre());
    }

    public AuthResponse login(LoginRequest request) {
        Usuario user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        user.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(user);

        return new AuthResponse("Acceso exitoso", user.getId(), user.getEmail(), user.getRol().getNombre());
    }
}

