package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.encuesta.EncuestaRequest;
import com.zapopan.colmenas.dto.encuesta.EncuestaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Encuesta;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.EncuestaRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.EncuestaService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EncuestaServiceImpl implements EncuestaService {

    private final EncuestaRepository encuestaRepository;
    private final UsuarioRepository usuarioRepository;

    public EncuestaServiceImpl(EncuestaRepository encuestaRepository, UsuarioRepository usuarioRepository) {
        this.encuestaRepository = encuestaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<EncuestaResponse> getAllEncuestas() {
        return encuestaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EncuestaResponse getEncuestaById(Integer id) {
        Encuesta encuesta = encuestaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada con ID: " + id));
        return mapToResponse(encuesta);
    }

    @Override
    public EncuestaResponse createEncuesta(EncuestaRequest encuestaRequest) {
        Usuario creadoPor = null;
        if (encuestaRequest.getCreadoPorId() != null) {
            creadoPor = usuarioRepository.findById(encuestaRequest.getCreadoPorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + encuestaRequest.getCreadoPorId()));
        }

        Encuesta encuesta = Encuesta.builder()
                .titulo(encuestaRequest.getTitulo())
                .descripcion(encuestaRequest.getDescripcion())
                .preguntasJson(encuestaRequest.getPreguntasJson())
                .fechaInicio(encuestaRequest.getFechaInicio())
                .fechaFin(encuestaRequest.getFechaFin())
                .activa(encuestaRequest.getActiva())
                .anonima(encuestaRequest.getAnonima())
                .creadoPor(creadoPor)
                .build();
        Encuesta savedEncuesta = encuestaRepository.save(encuesta);
        return mapToResponse(savedEncuesta);
    }

    @Override
    public EncuestaResponse updateEncuesta(Integer id, EncuestaRequest encuestaRequest) {
        Encuesta existingEncuesta = encuestaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada con ID: " + id));

        Usuario creadoPor = null;
        if (encuestaRequest.getCreadoPorId() != null) {
            creadoPor = usuarioRepository.findById(encuestaRequest.getCreadoPorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + encuestaRequest.getCreadoPorId()));
        }

        existingEncuesta.setTitulo(encuestaRequest.getTitulo());
        existingEncuesta.setDescripcion(encuestaRequest.getDescripcion());
        existingEncuesta.setPreguntasJson(encuestaRequest.getPreguntasJson());
        existingEncuesta.setFechaInicio(encuestaRequest.getFechaInicio());
        existingEncuesta.setFechaFin(encuestaRequest.getFechaFin());
        existingEncuesta.setActiva(encuestaRequest.getActiva());
        existingEncuesta.setAnonima(encuestaRequest.getAnonima());
        existingEncuesta.setCreadoPor(creadoPor);

        Encuesta updatedEncuesta = encuestaRepository.save(existingEncuesta);
        return mapToResponse(updatedEncuesta);
    }

    @Override
    public void deleteEncuesta(Integer id) {
        if (!encuestaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Encuesta no encontrada con ID: " + id);
        }
        encuestaRepository.deleteById(id);
    }

    private EncuestaResponse mapToResponse(Encuesta encuesta) {
        UsuarioResponse creadoPorResponse = null;
        if (encuesta.getCreadoPor() != null) {
            creadoPorResponse = new UsuarioResponse(
                    encuesta.getCreadoPor().getId(),
                    encuesta.getCreadoPor().getNombre(),
                    encuesta.getCreadoPor().getEmail(),
                    encuesta.getCreadoPor().getEdad(),
                    encuesta.getCreadoPor().getSexo(),
                    encuesta.getCreadoPor().getDomicilio(),
                    encuesta.getCreadoPor().getTelefono(),
                    encuesta.getCreadoPor().getEstatus(),
                    encuesta.getCreadoPor().getUltimoLogin(),
                    null, // Avoid deep recursion
                    encuesta.getCreadoPor().getCreadoEn()
            );
        }
        return new EncuestaResponse(
                encuesta.getId(),
                encuesta.getTitulo(),
                encuesta.getDescripcion(),
                encuesta.getPreguntasJson(),
                encuesta.getFechaInicio(),
                encuesta.getFechaFin(),
                encuesta.getActiva(),
                encuesta.getAnonima(),
                creadoPorResponse,
                encuesta.getCreadoEn()
        );
    }
}
