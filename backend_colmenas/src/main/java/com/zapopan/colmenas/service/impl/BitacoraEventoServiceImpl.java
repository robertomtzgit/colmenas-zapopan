package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.bitacoraevento.BitacoraEventoRequest;
import com.zapopan.colmenas.dto.bitacoraevento.BitacoraEventoResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.BitacoraEvento;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.BitacoraEventoRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.BitacoraEventoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BitacoraEventoServiceImpl implements BitacoraEventoService {

    private final BitacoraEventoRepository bitacoraEventoRepository;
    private final UsuarioRepository usuarioRepository;

    public BitacoraEventoServiceImpl(BitacoraEventoRepository bitacoraEventoRepository, UsuarioRepository usuarioRepository) {
        this.bitacoraEventoRepository = bitacoraEventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<BitacoraEventoResponse> getAllBitacoraEventos() {
        return bitacoraEventoRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BitacoraEventoResponse getBitacoraEventoById(Integer id) {
        BitacoraEvento bitacoraEvento = bitacoraEventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento de bitácora no encontrado con ID: " + id));
        return mapToResponse(bitacoraEvento);
    }

    @Override
    public BitacoraEventoResponse createBitacoraEvento(BitacoraEventoRequest bitacoraEventoRequest) {
        Usuario usuario = null;
        if (bitacoraEventoRequest.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(bitacoraEventoRequest.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + bitacoraEventoRequest.getUsuarioId()));
        }

        BitacoraEvento bitacoraEvento = BitacoraEvento.builder()
                .accion(bitacoraEventoRequest.getAccion())
                .modulo(bitacoraEventoRequest.getModulo())
                .entidad(bitacoraEventoRequest.getEntidad())
                .entidadId(bitacoraEventoRequest.getEntidadId())
                .descripcion(bitacoraEventoRequest.getDescripcion())
                .usuario(usuario)
                .ip(bitacoraEventoRequest.getIp())
                .datosAdicionales(bitacoraEventoRequest.getDatosAdicionales())
                .build();
        BitacoraEvento savedBitacoraEvento = bitacoraEventoRepository.save(bitacoraEvento);
        return mapToResponse(savedBitacoraEvento);
    }

    @Override
    public void deleteBitacoraEvento(Integer id) {
        if (!bitacoraEventoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento de bitácora no encontrado con ID: " + id);
        }
        bitacoraEventoRepository.deleteById(id);
    }

    @Override
    public List<BitacoraEventoResponse> getBitacoraEventosByUsuarioId(Integer usuarioId) {
        return bitacoraEventoRepository.findByUsuarioId(usuarioId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BitacoraEventoResponse> getBitacoraEventosByModulo(String modulo) {
        return bitacoraEventoRepository.findByModulo(modulo).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BitacoraEventoResponse mapToResponse(BitacoraEvento bitacoraEvento) {
        UsuarioResponse usuarioResponse = null;
        if (bitacoraEvento.getUsuario() != null) {
            usuarioResponse = new UsuarioResponse(
                    bitacoraEvento.getUsuario().getId(),
                    bitacoraEvento.getUsuario().getNombre(),
                    bitacoraEvento.getUsuario().getEmail(),
                    bitacoraEvento.getUsuario().getEdad(),
                    bitacoraEvento.getUsuario().getSexo(),
                    bitacoraEvento.getUsuario().getDomicilio(),
                    bitacoraEvento.getUsuario().getTelefono(),
                    bitacoraEvento.getUsuario().getEstatus(),
                    bitacoraEvento.getUsuario().getUltimoLogin(),
                    null, // Avoid deep recursion
                    bitacoraEvento.getUsuario().getCreadoEn()
            );
        }
        return new BitacoraEventoResponse(
                bitacoraEvento.getId(),
                bitacoraEvento.getAccion(),
                bitacoraEvento.getModulo(),
                bitacoraEvento.getEntidad(),
                bitacoraEvento.getEntidadId(),
                bitacoraEvento.getDescripcion(),
                usuarioResponse,
                bitacoraEvento.getIp(),
                bitacoraEvento.getFechaEvento(),
                bitacoraEvento.getDatosAdicionales()
        );
    }
}
