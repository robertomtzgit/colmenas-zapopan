package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.reporte.ReporteRequest;
import com.zapopan.colmenas.dto.reporte.ReporteResponse;
import com.zapopan.colmenas.model.enums.EstadoReporte;
import com.zapopan.colmenas.model.enums.PrioridadReporte;
import com.zapopan.colmenas.service.ReporteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping
    public ResponseEntity<List<ReporteResponse>> getAllReportes() {
        List<ReporteResponse> reportes = reporteService.getAllReportes();
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReporteResponse> getReporteById(@PathVariable Integer id) {
        ReporteResponse reporte = reporteService.getReporteById(id);
        return ResponseEntity.ok(reporte);
    }

    @PostMapping
    public ResponseEntity<ReporteResponse> createReporte(@Valid @RequestBody ReporteRequest reporteRequest) {
        ReporteResponse createdReporte = reporteService.createReporte(reporteRequest);
        return new ResponseEntity<>(createdReporte, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReporteResponse> updateReporte(@PathVariable Integer id, @Valid @RequestBody ReporteRequest reporteRequest) {
        ReporteResponse updatedReporte = reporteService.updateReporte(id, reporteRequest);
        return ResponseEntity.ok(updatedReporte);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReporte(@PathVariable Integer id) {
        reporteService.deleteReporte(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReporteResponse>> getReportesByEstado(@PathVariable EstadoReporte estado) {
        List<ReporteResponse> reportes = reporteService.getReportesByEstado(estado);
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/prioridad/{prioridad}")
    public ResponseEntity<List<ReporteResponse>> getReportesByPrioridad(@PathVariable PrioridadReporte prioridad) {
        List<ReporteResponse> reportes = reporteService.getReportesByPrioridad(prioridad);
        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReporteResponse>> getReportesByUsuarioId(@PathVariable Integer usuarioId) {
        List<ReporteResponse> reportes = reporteService.getReportesByUsuarioId(usuarioId);
        return ResponseEntity.ok(reportes);
    }
}
