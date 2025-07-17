package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.role.RoleResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioRequest;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Role;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.RoleRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UsuarioResponse> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponse getUsuarioById(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return mapToResponse(usuario);
    }

    @Override
    public UsuarioResponse createUsuario(UsuarioRequest usuarioRequest) {
        if (usuarioRepository.existsByEmail(usuarioRequest.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado.");
        }

        Role role = roleRepository.findById(usuarioRequest.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + usuarioRequest.getRolId()));

        Usuario usuario = Usuario.builder()
                .nombre(usuarioRequest.getNombre())
                .email(usuarioRequest.getEmail())
                .password(passwordEncoder.encode(usuarioRequest.getPassword()))
                .edad(usuarioRequest.getEdad())
                .sexo(usuarioRequest.getSexo())
                .domicilio(usuarioRequest.getDomicilio())
                .telefono(usuarioRequest.getTelefono())
                .estatus(usuarioRequest.getEstatus()) // Aseguramos que se use el estatus del request
                .rol(role)
                .creadoEn(LocalDateTime.now())
                .build();
        Usuario savedUsuario = usuarioRepository.save(usuario);
        return mapToResponse(savedUsuario);
    }

    @Override
    public UsuarioResponse updateUsuario(Integer id, UsuarioRequest usuarioRequest) {
        Usuario existingUsuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        if (!existingUsuario.getEmail().equals(usuarioRequest.getEmail()) && usuarioRepository.existsByEmail(usuarioRequest.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado por otro usuario.");
        }

        Role role = roleRepository.findById(usuarioRequest.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con ID: " + usuarioRequest.getRolId()));

        existingUsuario.setNombre(usuarioRequest.getNombre());
        existingUsuario.setEmail(usuarioRequest.getEmail());
        if (usuarioRequest.getPassword() != null && !usuarioRequest.getPassword().isEmpty()) {
            existingUsuario.setPassword(passwordEncoder.encode(usuarioRequest.getPassword()));
        }
        existingUsuario.setEdad(usuarioRequest.getEdad());
        existingUsuario.setSexo(usuarioRequest.getSexo());
        existingUsuario.setDomicilio(usuarioRequest.getDomicilio());
        existingUsuario.setTelefono(usuarioRequest.getTelefono());
        existingUsuario.setEstatus(usuarioRequest.getEstatus()); // Aseguramos que se use el estatus del request
        existingUsuario.setRol(role);

        Usuario updatedUsuario = usuarioRepository.save(existingUsuario);
        return mapToResponse(updatedUsuario);
    }

    @Override
    public void deleteUsuario(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioResponse mapToResponse(Usuario usuario) {
        RoleResponse roleResponse = null;
        if (usuario.getRol() != null) {
            roleResponse = new RoleResponse(usuario.getRol().getId(), usuario.getRol().getNombre());
        }
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getEdad(),
                usuario.getSexo(),
                usuario.getDomicilio(),
                usuario.getTelefono(),
                usuario.getEstatus(), // Ahora disponible
                usuario.getUltimoLogin(), // Ahora disponible
                roleResponse,
                usuario.getCreadoEn()
        );
    }
}
