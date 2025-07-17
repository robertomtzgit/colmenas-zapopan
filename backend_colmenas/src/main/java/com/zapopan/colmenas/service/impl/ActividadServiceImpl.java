package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.actividad.ActividadRequest;
import com.zapopan.colmenas.dto.actividad.ActividadResponse;
import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadResponse;
import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Actividad;
import com.zapopan.colmenas.model.CategoriaActividad;
import com.zapopan.colmenas.model.Colmena;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.ActividadRepository;
import com.zapopan.colmenas.repository.CategoriaActividadRepository;
import com.zapopan.colmenas.repository.ColmenaRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.ActividadService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActividadServiceImpl implements ActividadService {

    private final ActividadRepository actividadRepository;
    private final ColmenaRepository colmenaRepository;
    private final CategoriaActividadRepository categoriaActividadRepository;
    private final UsuarioRepository usuarioRepository;

    public ActividadServiceImpl(ActividadRepository actividadRepository, ColmenaRepository colmenaRepository, CategoriaActividadRepository categoriaActividadRepository, UsuarioRepository usuarioRepository) {
        this.actividadRepository = actividadRepository;
        this.colmenaRepository = colmenaRepository;
        this.categoriaActividadRepository = categoriaActividadRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<ActividadResponse> getAllActividades() {
        return actividadRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ActividadResponse getActividadById(Integer id) {
        Actividad actividad = actividadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada con ID: " + id));
        return mapToResponse(actividad);
    }

    @Override
    public ActividadResponse createActividad(ActividadRequest actividadRequest) {
        Colmena colmena = null;
        if (actividadRequest.getColmenaId() != null) {
            colmena = colmenaRepository.findById(actividadRequest.getColmenaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + actividadRequest.getColmenaId()));
        }

        CategoriaActividad categoria = null;
        if (actividadRequest.getCategoriaId() != null) {
            categoria = categoriaActividadRepository.findById(actividadRequest.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría de actividad no encontrada con ID: " + actividadRequest.getCategoriaId()));
        }

        Usuario creadoPor = null;
        if (actividadRequest.getCreadoPorId() != null) {
            creadoPor = usuarioRepository.findById(actividadRequest.getCreadoPorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + actividadRequest.getCreadoPorId()));
        }

        Actividad actividad = Actividad.builder()
                .titulo(actividadRequest.getTitulo())
                .descripcion(actividadRequest.getDescripcion())
                .fechaInicio(actividadRequest.getFechaInicio())
                .fechaFin(actividadRequest.getFechaFin())
                .ubicacion(actividadRequest.getUbicacion())
                .capacidadMaxima(actividadRequest.getCapacidadMaxima())
                .colmena(colmena)
                .categoria(categoria)
                .creadoPor(creadoPor)
                .imagenUrl(actividadRequest.getImagenUrl())
                .activa(actividadRequest.getActiva())
                .build();
        Actividad savedActividad = actividadRepository.save(actividad);
        return mapToResponse(savedActividad);
    }

    @Override
    public ActividadResponse updateActividad(Integer id, ActividadRequest actividadRequest) {
        Actividad existingActividad = actividadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Actividad no encontrada con ID: " + id));

        Colmena colmena = null;
        if (actividadRequest.getColmenaId() != null) {
            colmena = colmenaRepository.findById(actividadRequest.getColmenaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + actividadRequest.getColmenaId()));
        }

        CategoriaActividad categoria = null;
        if (actividadRequest.getCategoriaId() != null) {
            categoria = categoriaActividadRepository.findById(actividadRequest.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría de actividad no encontrada con ID: " + actividadRequest.getCategoriaId()));
        }

        Usuario creadoPor = null;
        if (actividadRequest.getCreadoPorId() != null) {
            creadoPor = usuarioRepository.findById(actividadRequest.getCreadoPorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + actividadRequest.getCreadoPorId()));
        }

        existingActividad.setTitulo(actividadRequest.getTitulo());
        existingActividad.setDescripcion(actividadRequest.getDescripcion());
        existingActividad.setFechaInicio(actividadRequest.getFechaInicio());
        existingActividad.setFechaFin(actividadRequest.getFechaFin());
        existingActividad.setUbicacion(actividadRequest.getUbicacion());
        existingActividad.setCapacidadMaxima(actividadRequest.getCapacidadMaxima());
        existingActividad.setColmena(colmena);
        existingActividad.setCategoria(categoria);
        existingActividad.setCreadoPor(creadoPor);
        existingActividad.setImagenUrl(actividadRequest.getImagenUrl());
        existingActividad.setActiva(actividadRequest.getActiva());

        Actividad updatedActividad = actividadRepository.save(existingActividad);
        return mapToResponse(updatedActividad);
    }

    @Override
    public void deleteActividad(Integer id) {
        if (!actividadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Actividad no encontrada con ID: " + id);
        }
        actividadRepository.deleteById(id);
    }

    private ActividadResponse mapToResponse(Actividad actividad) {
        ColmenaResponse colmenaResponse = null;
        if (actividad.getColmena() != null) {
            colmenaResponse = new ColmenaResponse(
                    actividad.getColmena().getId(),
                    actividad.getColmena().getNombre(),
                    actividad.getColmena().getDireccion(),
                    actividad.getColmena().getColonia(),
                    actividad.getColmena().getCodigoPostal(),
                    actividad.getColmena().getLatitud(),
                    actividad.getColmena().getLongitud(),
                    actividad.getColmena().getTelefono(),
                    actividad.getColmena().getImagenUrl(),
                    null, // Avoid deep recursion
                    actividad.getColmena().getActiva()
            );
        }

        CategoriaActividadResponse categoriaResponse = null;
        if (actividad.getCategoria() != null) {
            categoriaResponse = new CategoriaActividadResponse(
                    actividad.getCategoria().getId(),
                    actividad.getCategoria().getNombre(),
                    actividad.getCategoria().getDescripcion(),
                    actividad.getCategoria().getColor(),
                    actividad.getCategoria().getIcono(),
                    actividad.getCategoria().getActiva()
            );
        }

        UsuarioResponse creadoPorResponse = null;
        if (actividad.getCreadoPor() != null) {
            creadoPorResponse = new UsuarioResponse(
                    actividad.getCreadoPor().getId(),
                    actividad.getCreadoPor().getNombre(),
                    actividad.getCreadoPor().getEmail(),
                    actividad.getCreadoPor().getEdad(),
                    actividad.getCreadoPor().getSexo(),
                    actividad.getCreadoPor().getDomicilio(),
                    actividad.getCreadoPor().getTelefono(),
                    actividad.getCreadoPor().getEstatus(),
                    actividad.getCreadoPor().getUltimoLogin(),
                    null, // Avoid deep recursion
                    actividad.getCreadoPor().getCreadoEn() // <-- Added this missing field
            );
        }

        return new ActividadResponse(
                actividad.getId(),
                actividad.getTitulo(),
                actividad.getDescripcion(),
                actividad.getFechaInicio(),
                actividad.getFechaFin(),
                actividad.getUbicacion(),
                actividad.getCapacidadMaxima(),
                colmenaResponse,
                categoriaResponse,
                creadoPorResponse,
                actividad.getImagenUrl(),
                actividad.getActiva(),
                actividad.getCreadoEn()
        );
    }
}
