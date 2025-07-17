package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteRequest;
import com.zapopan.colmenas.dto.categoriareporte.CategoriaReporteResponse;
import com.zapopan.colmenas.service.CategoriaReporteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias-reporte")
public class CategoriaReporteController {

    private final CategoriaReporteService categoriaReporteService;

    public CategoriaReporteController(CategoriaReporteService categoriaReporteService) {
        this.categoriaReporteService = categoriaReporteService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaReporteResponse>> getAllCategoriasReporte() {
        List<CategoriaReporteResponse> categorias = categoriaReporteService.getAllCategoriasReporte();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaReporteResponse> getCategoriaReporteById(@PathVariable Integer id) {
        CategoriaReporteResponse categoria = categoriaReporteService.getCategoriaReporteById(id);
        return ResponseEntity.ok(categoria);
    }

    @PostMapping
    public ResponseEntity<CategoriaReporteResponse> createCategoriaReporte(@Valid @RequestBody CategoriaReporteRequest categoriaReporteRequest) {
        CategoriaReporteResponse createdCategoria = categoriaReporteService.createCategoriaReporte(categoriaReporteRequest);
        return new ResponseEntity<>(createdCategoria, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaReporteResponse> updateCategoriaReporte(@PathVariable Integer id, @Valid @RequestBody CategoriaReporteRequest categoriaReporteRequest) {
        CategoriaReporteResponse updatedCategoria = categoriaReporteService.updateCategoriaReporte(id, categoriaReporteRequest);
        return ResponseEntity.ok(updatedCategoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoriaReporte(@PathVariable Integer id) {
        categoriaReporteService.deleteCategoriaReporte(id);
        return ResponseEntity.noContent().build();
    }
}
