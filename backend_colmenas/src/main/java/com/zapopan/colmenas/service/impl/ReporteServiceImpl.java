package com.zapopan.colmenas.service.impl;

import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteResponse;
import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.dto.reporte.ReporteRequest;
import com.zapopan.colmenas.dto.reporte.ReporteResponse;
import com.zapopan.colmenas.dto.usuario.UsuarioResponse;
import com.zapopan.colmenas.exception.ResourceNotFoundException;
import com.zapopan.colmenas.model.CategoriaReporte;
import com.zapopan.colmenas.model.Colmena;
import com.zapopan.colmenas.model.Reporte;
import com.zapopan.colmenas.model.Usuario;
import com.zapopan.colmenas.model.enums.EstadoReporte;
import com.zapopan.colmenas.model.enums.PrioridadReporte;
import com.zapopan.colmenas.repository.CategoriaReporteRepository;
import com.zapopan.colmenas.repository.ColmenaRepository;
import com.zapopan.colmenas.repository.ReporteRepository;
import com.zapopan.colmenas.repository.UsuarioRepository;
import com.zapopan.colmenas.service.ReporteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteServiceImpl implements ReporteService {

    private final ReporteRepository reporteRepository;
    private final CategoriaReporteRepository categoriaReporteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ColmenaRepository colmenaRepository;

    public ReporteServiceImpl(ReporteRepository reporteRepository, CategoriaReporteRepository categoriaReporteRepository, UsuarioRepository usuarioRepository, ColmenaRepository colmenaRepository) {
        this.reporteRepository = reporteRepository;
        this.categoriaReporteRepository = categoriaReporteRepository;
        this.usuarioRepository = usuarioRepository;
        this.colmenaRepository = colmenaRepository;
    }

    @Override
    public List<ReporteResponse> getAllReportes() {
        return reporteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReporteResponse getReporteById(Integer id) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado con ID: " + id));
        return mapToResponse(reporte);
    }

    @Override
    public ReporteResponse createReporte(ReporteRequest reporteRequest) {
        CategoriaReporte categoria = categoriaReporteRepository.findById(reporteRequest.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría de reporte no encontrada con ID: " + reporteRequest.getCategoriaId()));

        Usuario usuario = null;
        if (reporteRequest.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(reporteRequest.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + reporteRequest.getUsuarioId()));
        }

        Colmena colmena = null;
        if (reporteRequest.getColmenaId() != null) {
            colmena = colmenaRepository.findById(reporteRequest.getColmenaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + reporteRequest.getColmenaId()));
        }

        Usuario asignadoA = null;
        if (reporteRequest.getAsignadoAId() != null) {
            asignadoA = usuarioRepository.findById(reporteRequest.getAsignadoAId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario asignado no encontrado con ID: " + reporteRequest.getAsignadoAId()));
        }

        Reporte reporte = Reporte.builder()
                .titulo(reporteRequest.getTitulo())
                .descripcion(reporteRequest.getDescripcion())
                .categoria(categoria)
                .estado(reporteRequest.getEstado())
                .prioridad(reporteRequest.getPrioridad())
                .ubicacion(reporteRequest.getUbicacion())
                .latitud(reporteRequest.getLatitud())
                .longitud(reporteRequest.getLongitud())
                .imagenUrl(reporteRequest.getImagenUrl())
                .usuario(usuario)
                .colmena(colmena)
                .asignadoA(asignadoA)
                .comentarioResolucion(reporteRequest.getComentarioResolucion())
                .fechaResolucion(reporteRequest.getFechaResolucion())
                .build();
        Reporte savedReporte = reporteRepository.save(reporte);
        return mapToResponse(savedReporte);
    }

    @Override
    public ReporteResponse updateReporte(Integer id, ReporteRequest reporteRequest) {
        Reporte existingReporte = reporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado con ID: " + id));

        CategoriaReporte categoria = categoriaReporteRepository.findById(reporteRequest.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría de reporte no encontrada con ID: " + reporteRequest.getCategoriaId()));

        Usuario usuario = null;
        if (reporteRequest.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(reporteRequest.getUsuarioId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + reporteRequest.getUsuarioId()));
        }

        Colmena colmena = null;
        if (reporteRequest.getColmenaId() != null) {
            colmena = colmenaRepository.findById(reporteRequest.getColmenaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Colmena no encontrada con ID: " + reporteRequest.getColmenaId()));
        }

        Usuario asignadoA = null;
        if (reporteRequest.getAsignadoAId() != null) {
            asignadoA = usuarioRepository.findById(reporteRequest.getAsignadoAId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario asignado no encontrado con ID: " + reporteRequest.getAsignadoAId()));
        }

        existingReporte.setTitulo(reporteRequest.getTitulo());
        existingReporte.setDescripcion(reporteRequest.getDescripcion());
        existingReporte.setCategoria(categoria);
        existingReporte.setEstado(reporteRequest.getEstado());
        existingReporte.setPrioridad(reporteRequest.getPrioridad());
        existingReporte.setUbicacion(reporteRequest.getUbicacion());
        existingReporte.setLatitud(reporteRequest.getLatitud());
        existingReporte.setLongitud(reporteRequest.getLongitud());
        existingReporte.setImagenUrl(reporteRequest.getImagenUrl());
        existingReporte.setUsuario(usuario);
        existingReporte.setColmena(colmena);
        existingReporte.setAsignadoA(asignadoA);
        existingReporte.setComentarioResolucion(reporteRequest.getComentarioResolucion());
        existingReporte.setFechaResolucion(reporteRequest.getFechaResolucion());

        Reporte updatedReporte = reporteRepository.save(existingReporte);
        return mapToResponse(updatedReporte);
    }

    @Override
    public void deleteReporte(Integer id) {
        if (!reporteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reporte no encontrado con ID: " + id);
        }
        reporteRepository.deleteById(id);
    }

    @Override
    public List<ReporteResponse> getReportesByEstado(EstadoReporte estado) {
        return reporteRepository.findByEstado(estado).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteResponse> getReportesByPrioridad(PrioridadReporte prioridad) {
        return reporteRepository.findByPrioridad(prioridad).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteResponse> getReportesByUsuarioId(Integer usuarioId) {
        return reporteRepository.findByUsuarioId(usuarioId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReporteResponse mapToResponse(Reporte reporte) {
        CategoriaReporteResponse categoriaResponse = null;
        if (reporte.getCategoria() != null) {
            categoriaResponse = new CategoriaReporteResponse(
                    reporte.getCategoria().getId(),
                    reporte.getCategoria().getNombre(),
                    reporte.getCategoria().getDescripcion()
            );
        }

        UsuarioResponse usuarioResponse = null;
        if (reporte.getUsuario() != null) {
            usuarioResponse = new UsuarioResponse(
                    reporte.getUsuario().getId(),
                    reporte.getUsuario().getNombre(),
                    reporte.getUsuario().getEmail(),
                    reporte.getUsuario().getEdad(),
                    reporte.getUsuario().getSexo(),
                    reporte.getUsuario().getDomicilio(),
                    reporte.getUsuario().getTelefono(),
                    reporte.getUsuario().getEstatus(),
                    reporte.getUsuario().getUltimoLogin(),
                    null, // Avoid deep recursion
                    reporte.getUsuario().getCreadoEn()
            );
        }

        ColmenaResponse colmenaResponse = null;
        if (reporte.getColmena() != null) {
            colmenaResponse = new ColmenaResponse(
                    reporte.getColmena().getId(),
                    reporte.getColmena().getNombre(),
                    reporte.getColmena().getDireccion(),
                    reporte.getColmena().getColonia(),
                    reporte.getColmena().getCodigoPostal(),
                    reporte.getColmena().getLatitud(),
                    reporte.getColmena().getLongitud(),
                    reporte.getColmena().getTelefono(),
                    reporte.getColmena().getImagenUrl(),
                    null, // Avoid deep recursion
                    reporte.getColmena().getActiva()
            );
        }

        UsuarioResponse asignadoAResponse = null;
        if (reporte.getAsignadoA() != null) {
            asignadoAResponse = new UsuarioResponse(
                    reporte.getAsignadoA().getId(),
                    reporte.getAsignadoA().getNombre(),
                    reporte.getAsignadoA().getEmail(),
                    reporte.getAsignadoA().getEdad(),
                    reporte.getAsignadoA().getSexo(),
                    reporte.getAsignadoA().getDomicilio(),
                    reporte.getAsignadoA().getTelefono(),
                    reporte.getAsignadoA().getEstatus(),
                    reporte.getAsignadoA().getUltimoLogin(),
                    null, // Avoid deep recursion
                    reporte.getAsignadoA().getCreadoEn()
            );
        }

        return new ReporteResponse(
                reporte.getId(),
                reporte.getTitulo(),
                reporte.getDescripcion(),
                categoriaResponse,
                reporte.getEstado(),
                reporte.getPrioridad(),
                reporte.getUbicacion(),
                reporte.getLatitud(),
                reporte.getLongitud(),
                reporte.getImagenUrl(),
                usuarioResponse,
                colmenaResponse,
                asignadoAResponse,
                reporte.getComentarioResolucion(),
                reporte.getFechaCreacion(),
                reporte.getFechaResolucion()
        );
    }
}
