package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteRequest;
import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.CategoriaReporte;
import com.zapopan.colmenas.repository.CategoriaReporteRepository;
import com.zapopan.colmenas.service.CategoriaReporteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaReporteServiceImpl implements CategoriaReporteService {

    private final CategoriaReporteRepository categoriaReporteRepository;

    public CategoriaReporteServiceImpl(CategoriaReporteRepository categoriaReporteRepository) {
        this.categoriaReporteRepository = categoriaReporteRepository;
    }

    @Override
    public List<CategoriaReporteResponse> getAllCategoriasReporte() {
        return categoriaReporteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaReporteResponse getCategoriaReporteById(Integer id) {
        CategoriaReporte categoriaReporte = categoriaReporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría de reporte no encontrada con ID: " + id));
        return mapToResponse(categoriaReporte);
    }

    @Override
    public CategoriaReporteResponse createCategoriaReporte(CategoriaReporteRequest categoriaReporteRequest) {
        CategoriaReporte categoriaReporte = CategoriaReporte.builder()
                .nombre(categoriaReporteRequest.getNombre())
                .descripcion(categoriaReporteRequest.getDescripcion())
                .build();
        CategoriaReporte savedCategoriaReporte = categoriaReporteRepository.save(categoriaReporte);
        return mapToResponse(savedCategoriaReporte);
    }

    @Override
    public CategoriaReporteResponse updateCategoriaReporte(Integer id, CategoriaReporteRequest categoriaReporteRequest) {
        CategoriaReporte existingCategoriaReporte = categoriaReporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría de reporte no encontrada con ID: " + id));

        existingCategoriaReporte.setNombre(categoriaReporteRequest.getNombre());
        existingCategoriaReporte.setDescripcion(categoriaReporteRequest.getDescripcion());

        CategoriaReporte updatedCategoriaReporte = categoriaReporteRepository.save(existingCategoriaReporte);
        return mapToResponse(updatedCategoriaReporte);
    }

    @Override
    public void deleteCategoriaReporte(Integer id) {
        if (!categoriaReporteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría de reporte no encontrada con ID: " + id);
        }
        categoriaReporteRepository.deleteById(id);
    }

    private CategoriaReporteResponse mapToResponse(CategoriaReporte categoriaReporte) {
        return new CategoriaReporteResponse(
                categoriaReporte.getId(),
                categoriaReporte.getNombre(),
                categoriaReporte.getDescripcion()
        );
    }
}
