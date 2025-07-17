package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.colmena.ColmenaRequest;
import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.Colmena;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.repository.ColmenaRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.ColmenaService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ColmenaServiceImpl implements ColmenaService {

    private final ColmenaRepository colmenaRepository;
    private final UsuarioRepository usuarioRepository;

    public ColmenaServiceImpl(ColmenaRepository colmenaRepository, UsuarioRepository usuarioRepository) {
        this.colmenaRepository = colmenaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<ColmenaResponse> getAllColmenas() {
        return colmenaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ColmenaResponse getColmenaById(Integer id) {
        Colmena colmena = colmenaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + id));
        return mapToResponse(colmena);
    }

    @Override
    public ColmenaResponse createColmena(ColmenaRequest colmenaRequest) {
        Usuario responsable = null;
        if (colmenaRequest.getResponsableId() != null) {
            responsable = usuarioRepository.findById(colmenaRequest.getResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario responsable no encontrado con ID: " + colmenaRequest.getResponsableId()));
        }

        Colmena colmena = Colmena.builder()
                .nombre(colmenaRequest.getNombre())
                .direccion(colmenaRequest.getDireccion())
                .colonia(colmenaRequest.getColonia())
                .codigoPostal(colmenaRequest.getCodigoPostal())
                .latitud(colmenaRequest.getLatitud())
                .longitud(colmenaRequest.getLongitud())
                .telefono(colmenaRequest.getTelefono())
                .imagenUrl(colmenaRequest.getImagenUrl())
                .responsable(responsable)
                .activa(colmenaRequest.getActiva())
                .build();
        Colmena savedColmena = colmenaRepository.save(colmena);
        return mapToResponse(savedColmena);
    }

    @Override
    public ColmenaResponse updateColmena(Integer id, ColmenaRequest colmenaRequest) {
        Colmena existingColmena = colmenaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + id));

        Usuario responsable = null;
        if (colmenaRequest.getResponsableId() != null) {
            responsable = usuarioRepository.findById(colmenaRequest.getResponsableId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario responsable no encontrado con ID: " + colmenaRequest.getResponsableId()));
        }

        existingColmena.setNombre(colmenaRequest.getNombre());
        existingColmena.setDireccion(colmenaRequest.getDireccion());
        existingColmena.setColonia(colmenaRequest.getColonia());
        existingColmena.setCodigoPostal(colmenaRequest.getCodigoPostal());
        existingColmena.setLatitud(colmenaRequest.getLatitud());
        existingColmena.setLongitud(colmenaRequest.getLongitud());
        existingColmena.setTelefono(colmenaRequest.getTelefono());
        existingColmena.setImagenUrl(colmenaRequest.getImagenUrl());
        existingColmena.setResponsable(responsable);
        existingColmena.setActiva(colmenaRequest.getActiva());

        Colmena updatedColmena = colmenaRepository.save(existingColmena);
        return mapToResponse(updatedColmena);
    }

    @Override
    public void deleteColmena(Integer id) {
        if (!colmenaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Colmena no encontrada con ID: " + id);
        }
        colmenaRepository.deleteById(id);
    }

    private ColmenaResponse mapToResponse(Colmena colmena) {
        UsuarioResponse responsableResponse = null;
        if (colmena.getResponsable() != null) {
            responsableResponse = new UsuarioResponse(
                    colmena.getResponsable().getId(),
                    colmena.getResponsable().getNombre(),
                    colmena.getResponsable().getEmail(),
                    colmena.getResponsable().getEdad(),
                    colmena.getResponsable().getSexo(),
                    colmena.getResponsable().getDomicilio(),
                    colmena.getResponsable().getTelefono(),
                    colmena.getResponsable().getEstatus(),
                    colmena.getResponsable().getUltimoLogin(),
                    null, // Avoid deep recursion for role
                    colmena.getResponsable().getCreadoEn()
            );
        }
        return new ColmenaResponse(
                colmena.getId(),
                colmena.getNombre(),
                colmena.getDireccion(),
                colmena.getColonia(),
                colmena.getCodigoPostal(),
                colmena.getLatitud(),
                colmena.getLongitud(),
                colmena.getTelefono(),
                colmena.getImagenUrl(),
                responsableResponse,
                colmena.getActiva()
        );
    }
}
