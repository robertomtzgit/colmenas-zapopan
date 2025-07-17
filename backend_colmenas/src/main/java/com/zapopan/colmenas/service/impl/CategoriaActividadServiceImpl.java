package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadRequest;
import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.CategoriaActividad;
import com.zapopan.colmenas.repository.CategoriaActividadRepository;
import com.zapopan.colmenas.service.CategoriaActividadService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaActividadServiceImpl implements CategoriaActividadService {

    private final CategoriaActividadRepository categoriaActividadRepository;

    public CategoriaActividadServiceImpl(CategoriaActividadRepository categoriaActividadRepository) {
        this.categoriaActividadRepository = categoriaActividadRepository;
    }

    @Override
    public List<CategoriaActividadResponse> getAllCategoriasActividad() {
        return categoriaActividadRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaActividadResponse getCategoriaActividadById(Integer id) {
        CategoriaActividad categoriaActividad = categoriaActividadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría de actividad no encontrada con ID: " + id));
        return mapToResponse(categoriaActividad);
    }

    @Override
    public CategoriaActividadResponse createCategoriaActividad(CategoriaActividadRequest categoriaActividadRequest) {
        CategoriaActividad categoriaActividad = CategoriaActividad.builder()
                .nombre(categoriaActividadRequest.getNombre())
                .descripcion(categoriaActividadRequest.getDescripcion())
                .color(categoriaActividadRequest.getColor())
                .icono(categoriaActividadRequest.getIcono())
                .activa(categoriaActividadRequest.getActiva())
                .build();
        CategoriaActividad savedCategoriaActividad = categoriaActividadRepository.save(categoriaActividad);
        return mapToResponse(savedCategoriaActividad);
    }

    @Override
    public CategoriaActividadResponse updateCategoriaActividad(Integer id, CategoriaActividadRequest categoriaActividadRequest) {
        CategoriaActividad existingCategoriaActividad = categoriaActividadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría de actividad no encontrada con ID: " + id));

        existingCategoriaActividad.setNombre(categoriaActividadRequest.getNombre());
        existingCategoriaActividad.setDescripcion(categoriaActividadRequest.getDescripcion());
        existingCategoriaActividad.setColor(categoriaActividadRequest.getColor());
        existingCategoriaActividad.setIcono(categoriaActividadRequest.getIcono());
        existingCategoriaActividad.setActiva(categoriaActividadRequest.getActiva());

        CategoriaActividad updatedCategoriaActividad = categoriaActividadRepository.save(existingCategoriaActividad);
        return mapToResponse(updatedCategoriaActividad);
    }

    @Override
    public void deleteCategoriaActividad(Integer id) {
        if (!categoriaActividadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría de actividad no encontrada con ID: " + id);
        }
        categoriaActividadRepository.deleteById(id);
    }

    private CategoriaActividadResponse mapToResponse(CategoriaActividad categoriaActividad) {
        return new CategoriaActividadResponse(
                categoriaActividad.getId(),
                categoriaActividad.getNombre(),
                categoriaActividad.getDescripcion(),
                categoriaActividad.getColor(),
                categoriaActividad.getIcono(),
                categoriaActividad.getActiva()
        );
    }
}
