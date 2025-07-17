package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.encuesta.EncuestaResponse;
import com.zapopan.colmenas.dto.respuestaencuesta.RespuestaEncuestaRequest;
import com.zapopan.colmenas.dto.respuestaencuesta.RespuestaEncuestaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Encuesta;
import com.zapopan.colmenas.model.RespuestaEncuesta;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.EncuestaRepository;
import com.zapopan.colmenas.repository.RespuestaEncuestaRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.RespuestaEncuestaService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RespuestaEncuestaServiceImpl implements RespuestaEncuestaService {

    private final RespuestaEncuestaRepository respuestaEncuestaRepository;
    private final EncuestaRepository encuestaRepository;
    private final UsuarioRepository usuarioRepository;

    public RespuestaEncuestaServiceImpl(RespuestaEncuestaRepository respuestaEncuestaRepository, EncuestaRepository encuestaRepository, UsuarioRepository usuarioRepository) {
        this.respuestaEncuestaRepository = respuestaEncuestaRepository;
        this.encuestaRepository = encuestaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<RespuestaEncuestaResponse> getAllRespuestasEncuesta() {
        return respuestaEncuestaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RespuestaEncuestaResponse getRespuestaEncuestaById(Integer id) {
        RespuestaEncuesta respuestaEncuesta = respuestaEncuestaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Respuesta de encuesta no encontrada con ID: " + id));
        return mapToResponse(respuestaEncuesta);
    }

    @Override
    public RespuestaEncuestaResponse createRespuestaEncuesta(RespuestaEncuestaRequest respuestaEncuestaRequest) {
        Encuesta encuesta = encuestaRepository.findById(respuestaEncuestaRequest.getEncuestaId())
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada con ID: " + respuestaEncuestaRequest.getEncuestaId()));

        Usuario usuario = null;
        if (respuestaEncuestaRequest.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(respuestaEncuestaRequest.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + respuestaEncuestaRequest.getUsuarioId()));
        } else if (!encuesta.getAnonima()) {
            throw new IllegalArgumentException("El usuario es requerido para encuestas no anónimas.");
        }

        RespuestaEncuesta respuestaEncuesta = RespuestaEncuesta.builder()
                .encuesta(encuesta)
                .usuario(usuario)
                .respuestasJson(respuestaEncuestaRequest.getRespuestasJson())
                .build();
        RespuestaEncuesta savedRespuestaEncuesta = respuestaEncuestaRepository.save(respuestaEncuesta);
        return mapToResponse(savedRespuestaEncuesta);
    }

    @Override
    public void deleteRespuestaEncuesta(Integer id) {
        if (!respuestaEncuestaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Respuesta de encuesta no encontrada con ID: " + id);
        }
        respuestaEncuestaRepository.deleteById(id);
    }

    @Override
    public List<RespuestaEncuestaResponse> getRespuestasByEncuestaId(Integer encuestaId) {
        return respuestaEncuestaRepository.findByEncuestaId(encuestaId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<RespuestaEncuestaResponse> getRespuestasByUsuarioId(Integer usuarioId) {
        return respuestaEncuestaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RespuestaEncuestaResponse mapToResponse(RespuestaEncuesta respuestaEncuesta) {
        EncuestaResponse encuestaResponse = null;
        if (respuestaEncuesta.getEncuesta() != null) {
            encuestaResponse = new EncuestaResponse(
                    respuestaEncuesta.getEncuesta().getId(),
                    respuestaEncuesta.getEncuesta().getTitulo(),
                    respuestaEncuesta.getEncuesta().getDescripcion(),
                    respuestaEncuesta.getEncuesta().getPreguntasJson(),
                    respuestaEncuesta.getEncuesta().getFechaInicio(),
                    respuestaEncuesta.getEncuesta().getFechaFin(),
                    respuestaEncuesta.getEncuesta().getActiva(),
                    respuestaEncuesta.getEncuesta().getAnonima(),
                    null, // Avoid deep recursion
                    respuestaEncuesta.getEncuesta().getCreadoEn()
            );
        }

        UsuarioResponse usuarioResponse = null;
        if (respuestaEncuesta.getUsuario() != null) {
            usuarioResponse = new UsuarioResponse(
                    respuestaEncuesta.getUsuario().getId(),
                    respuestaEncuesta.getUsuario().getNombre(),
                    respuestaEncuesta.getUsuario().getEmail(),
                    respuestaEncuesta.getUsuario().getEdad(),
                    respuestaEncuesta.getUsuario().getSexo(),
                    respuestaEncuesta.getUsuario().getDomicilio(),
                    respuestaEncuesta.getUsuario().getTelefono(),
                    respuestaEncuesta.getUsuario().getEstatus(),
                    respuestaEncuesta.getUsuario().getUltimoLogin(),
                    null, // Avoid deep recursion
                    respuestaEncuesta.getUsuario().getCreadoEn()
            );
        }

        return new RespuestaEncuestaResponse(
                respuestaEncuesta.getId(),
                encuestaResponse,
                usuarioResponse,
                respuestaEncuesta.getRespuestasJson(),
                respuestaEncuesta.getFechaRespuesta()
        );
    }
}
