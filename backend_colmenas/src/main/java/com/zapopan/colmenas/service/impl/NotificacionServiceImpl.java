package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.dto.notificacion.NotificacionRequest;
import com.zapopan.colmenas.dto.notificacion.NotificacionResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Colmena;
import com.zapopan.colmenas.model.Notificacion;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.ColmenaRepository;
import com.zapopan.colmenas.repository.NotificacionRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.NotificacionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacionServiceImpl implements NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final ColmenaRepository colmenaRepository;

    public NotificacionServiceImpl(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository, ColmenaRepository colmenaRepository) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.colmenaRepository = colmenaRepository;
    }

    @Override
    public List<NotificacionResponse> getAllNotificaciones() {
        return notificacionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NotificacionResponse getNotificacionById(Integer id) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada con ID: " + id));
        return mapToResponse(notificacion);
    }

    @Override
    public NotificacionResponse createNotificacion(NotificacionRequest notificacionRequest) {
        Usuario usuario = null;
        if (notificacionRequest.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(notificacionRequest.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + notificacionRequest.getUsuarioId()));
        }

        Colmena colmena = null;
        if (notificacionRequest.getColmenaId() != null) {
            colmena = colmenaRepository.findById(notificacionRequest.getColmenaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + notificacionRequest.getColmenaId()));
        }

        Usuario creadoPor = null;
        if (notificacionRequest.getCreadoPorId() != null) {
            creadoPor = usuarioRepository.findById(notificacionRequest.getCreadoPorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + notificacionRequest.getCreadoPorId()));
        }

        Notificacion notificacion = Notificacion.builder()
                .titulo(notificacionRequest.getTitulo())
                .mensaje(notificacionRequest.getMensaje())
                .tipo(notificacionRequest.getTipo())
                .usuario(usuario)
                .colmena(colmena)
                .creadoPor(creadoPor)
                .leida(notificacionRequest.getLeida())
                .fechaLeida(notificacionRequest.getFechaLeida())
                .build();
        Notificacion savedNotificacion = notificacionRepository.save(notificacion);
        return mapToResponse(savedNotificacion);
    }

    @Override
    public NotificacionResponse updateNotificacion(Integer id, NotificacionRequest notificacionRequest) {
        Notificacion existingNotificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada con ID: " + id));

        Usuario usuario = null;
        if (notificacionRequest.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(notificacionRequest.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + notificacionRequest.getUsuarioId()));
        }

        Colmena colmena = null;
        if (notificacionRequest.getColmenaId() != null) {
            colmena = colmenaRepository.findById(notificacionRequest.getColmenaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + notificacionRequest.getColmenaId()));
        }

        Usuario creadoPor = null;
        if (notificacionRequest.getCreadoPorId() != null) {
            creadoPor = usuarioRepository.findById(notificacionRequest.getCreadoPorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + notificacionRequest.getCreadoPorId()));
        }

        existingNotificacion.setTitulo(notificacionRequest.getTitulo());
        existingNotificacion.setMensaje(notificacionRequest.getMensaje());
        existingNotificacion.setTipo(notificacionRequest.getTipo());
        existingNotificacion.setUsuario(usuario);
        existingNotificacion.setColmena(colmena);
        existingNotificacion.setCreadoPor(creadoPor);
        existingNotificacion.setLeida(notificacionRequest.getLeida());
        existingNotificacion.setFechaLeida(notificacionRequest.getFechaLeida());

        Notificacion updatedNotificacion = notificacionRepository.save(existingNotificacion);
        return mapToResponse(updatedNotificacion);
    }

    @Override
    public void deleteNotificacion(Integer id) {
        if (!notificacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notificación no encontrada con ID: " + id);
        }
        notificacionRepository.deleteById(id);
    }

    @Override
    public List<NotificacionResponse> getNotificacionesByUsuarioId(Integer usuarioId) {
        return notificacionRepository.findByUsuarioId(usuarioId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificacionResponse> getUnreadNotificacionesByUsuarioId(Integer usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidaFalse(usuarioId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NotificacionResponse markAsRead(Integer id) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada con ID: " + id));
        notificacion.setLeida(true);
        notificacion.setFechaLeida(LocalDateTime.now());
        Notificacion updatedNotificacion = notificacionRepository.save(notificacion);
        return mapToResponse(updatedNotificacion);
    }

    private NotificacionResponse mapToResponse(Notificacion notificacion) {
        UsuarioResponse usuarioResponse = null;
        if (notificacion.getUsuario() != null) {
            usuarioResponse = new UsuarioResponse(
                    notificacion.getUsuario().getId(),
                    notificacion.getUsuario().getNombre(),
                    notificacion.getUsuario().getEmail(),
                    notificacion.getUsuario().getEdad(),
                    notificacion.getUsuario().getSexo(),
                    notificacion.getUsuario().getDomicilio(),
                    notificacion.getUsuario().getTelefono(),
                    notificacion.getUsuario().getEstatus(),
                    notificacion.getUsuario().getUltimoLogin(),
                    null, // Avoid deep recursion
                    notificacion.getUsuario().getCreadoEn()
            );
        }

        ColmenaResponse colmenaResponse = null;
        if (notificacion.getColmena() != null) {
            colmenaResponse = new ColmenaResponse(
                    notificacion.getColmena().getId(),
                    notificacion.getColmena().getNombre(),
                    notificacion.getColmena().getDireccion(),
                    notificacion.getColmena().getColonia(),
                    notificacion.getColmena().getCodigoPostal(),
                    notificacion.getColmena().getLatitud(),
                    notificacion.getColmena().getLongitud(),
                    notificacion.getColmena().getTelefono(),
                    notificacion.getColmena().getImagenUrl(),
                    null, // Avoid deep recursion
                    notificacion.getColmena().getActiva()
            );
        }

        UsuarioResponse creadoPorResponse = null;
        if (notificacion.getCreadoPor() != null) {
            creadoPorResponse = new UsuarioResponse(
                    notificacion.getCreadoPor().getId(),
                    notificacion.getCreadoPor().getNombre(),
                    notificacion.getCreadoPor().getEmail(),
                    notificacion.getCreadoPor().getEdad(),
                    notificacion.getCreadoPor().getSexo(),
                    notificacion.getCreadoPor().getDomicilio(),
                    notificacion.getCreadoPor().getTelefono(),
                    notificacion.getCreadoPor().getEstatus(),
                    notificacion.getCreadoPor().getUltimoLogin(),
                    null, // Avoid deep recursion
                    notificacion.getCreadoPor().getCreadoEn()
            );
        }

        return new NotificacionResponse(
                notificacion.getId(),
                notificacion.getTitulo(),
                notificacion.getMensaje(),
                notificacion.getTipo(),
                usuarioResponse,
                colmenaResponse,
                creadoPorResponse,
                notificacion.getLeida(),
                notificacion.getFechaCreacion(),
                notificacion.getFechaLeida()
        );
    }
}
