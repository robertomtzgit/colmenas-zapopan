package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.actividad.ActividadResponse;
import com.zapopan.colmenas.dto.inscripcion.InscripcionRequest;
import com.zapopan.colmenas.dto.inscripcion.InscripcionResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Actividad;
import com.zapopan.colmenas.model.Inscripcion;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.ActividadRepository;
import com.zapopan.colmenas.repository.InscripcionRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.InscripcionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InscripcionServiceImpl implements InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final ActividadRepository actividadRepository;
    private final UsuarioRepository usuarioRepository;

    public InscripcionServiceImpl(InscripcionRepository inscripcionRepository, ActividadRepository actividadRepository, UsuarioRepository usuarioRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.actividadRepository = actividadRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<InscripcionResponse> getAllInscripciones() {
        return inscripcionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InscripcionResponse getInscripcionById(Integer id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripción no encontrada con ID: " + id));
        return mapToResponse(inscripcion);
    }

    @Override
    public InscripcionResponse createInscripcion(InscripcionRequest inscripcionRequest) {
        Actividad actividad = actividadRepository.findById(inscripcionRequest.getActividadId())
                .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada con ID: " + inscripcionRequest.getActividadId()));

        Usuario usuario = usuarioRepository.findById(inscripcionRequest.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + inscripcionRequest.getUsuarioId()));

        if (inscripcionRepository.findByActividadIdAndUsuarioId(actividad.getId(), usuario.getId()).isPresent()) {
            throw new IllegalArgumentException("El usuario ya está inscrito en esta actividad.");
        }

        Inscripcion inscripcion = Inscripcion.builder()
                .actividad(actividad)
                .usuario(usuario)
                .build();
        Inscripcion savedInscripcion = inscripcionRepository.save(inscripcion);
        return mapToResponse(savedInscripcion);
    }

    @Override
    public void deleteInscripcion(Integer id) {
        if (!inscripcionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inscripción no encontrada con ID: " + id);
        }
        inscripcionRepository.deleteById(id);
    }

    @Override
    public List<InscripcionResponse> getInscripcionesByUsuarioId(Integer usuarioId) {
        return inscripcionRepository.findByUsuarioId(usuarioId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InscripcionResponse> getInscripcionesByActividadId(Integer actividadId) {
        return inscripcionRepository.findByActividadId(actividadId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InscripcionResponse mapToResponse(Inscripcion inscripcion) {
        ActividadResponse actividadResponse = null;
        if (inscripcion.getActividad() != null) {
            actividadResponse = new ActividadResponse(
                    inscripcion.getActividad().getId(),
                    inscripcion.getActividad().getTitulo(),
                    inscripcion.getActividad().getDescripcion(),
                    inscripcion.getActividad().getFechaInicio(),
                    inscripcion.getActividad().getFechaFin(),
                    inscripcion.getActividad().getUbicacion(),
                    inscripcion.getActividad().getCapacidadMaxima(),
                    null, null, null, null, null, null // Avoid deep recursion
            );
        }

        UsuarioResponse usuarioResponse = null;
        if (inscripcion.getUsuario() != null) {
            usuarioResponse = new UsuarioResponse(
                    inscripcion.getUsuario().getId(),
                    inscripcion.getUsuario().getNombre(),
                    inscripcion.getUsuario().getEmail(),
                    inscripcion.getUsuario().getEdad(),
                    inscripcion.getUsuario().getSexo(),
                    inscripcion.getUsuario().getDomicilio(),
                    inscripcion.getUsuario().getTelefono(),
                    inscripcion.getUsuario().getEstatus(),
                    inscripcion.getUsuario().getUltimoLogin(),
                    null, // Avoid deep recursion
                    inscripcion.getUsuario().getCreadoEn()
            );
        }

        return new InscripcionResponse(
                inscripcion.getId(),
                actividadResponse,
                usuarioResponse,
                inscripcion.getFechaInscripcion()
        );
    }
}
