package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadRequest;
import com.zapopan.colmenas.dto.categoriaactividad.CategoriaActividadResponse;
import com.zapopan.colmenas.service.CategoriaActividadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias-actividad")
public class CategoriaActividadController {

    private final CategoriaActividadService categoriaActividadService;

    public CategoriaActividadController(CategoriaActividadService categoriaActividadService) {
        this.categoriaActividadService = categoriaActividadService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaActividadResponse>> getAllCategoriasActividad() {
        List<CategoriaActividadResponse> categorias = categoriaActividadService.getAllCategoriasActividad();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaActividadResponse> getCategoriaActividadById(@PathVariable Integer id) {
        CategoriaActividadResponse categoria = categoriaActividadService.getCategoriaActividadById(id);
        return ResponseEntity.ok(categoria);
    }

    @PostMapping
    public ResponseEntity<CategoriaActividadResponse> createCategoriaActividad(@Valid @RequestBody CategoriaActividadRequest categoriaActividadRequest) {
        CategoriaActividadResponse createdCategoria = categoriaActividadService.createCategoriaActividad(categoriaActividadRequest);
        return new ResponseEntity<>(createdCategoria, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaActividadResponse> updateCategoriaActividad(@PathVariable Integer id, @Valid @RequestBody CategoriaActividadRequest categoriaActividadRequest) {
        CategoriaActividadResponse updatedCategoria = categoriaActividadService.updateCategoriaActividad(id, categoriaActividadRequest);
        return ResponseEntity.ok(updatedCategoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoriaActividad(@PathVariable Integer id) {
        categoriaActividadService.deleteCategoriaActividad(id);
        return ResponseEntity.noContent().build();
    }
}
