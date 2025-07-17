package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.inscripcion.InscripcionRequest;
import com.zapopan.colmenas.dto.inscripcion.InscripcionResponse;
import com.zapopan.colmenas.service.InscripcionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    private final InscripcionService inscripcionService;

    public InscripcionController(InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    @GetMapping
    public ResponseEntity<List<InscripcionResponse>> getAllInscripciones() {
        List<InscripcionResponse> inscripciones = inscripcionService.getAllInscripciones();
        return ResponseEntity.ok(inscripciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InscripcionResponse> getInscripcionById(@PathVariable Integer id) {
        InscripcionResponse inscripcion = inscripcionService.getInscripcionById(id);
        return ResponseEntity.ok(inscripcion);
    }

    @PostMapping
    public ResponseEntity<InscripcionResponse> createInscripcion(@Valid @RequestBody InscripcionRequest inscripcionRequest) {
        InscripcionResponse createdInscripcion = inscripcionService.createInscripcion(inscripcionRequest);
        return new ResponseEntity<>(createdInscripcion, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInscripcion(@PathVariable Integer id) {
        inscripcionService.deleteInscripcion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<InscripcionResponse>> getInscripcionesByUsuarioId(@PathVariable Integer usuarioId) {
        List<InscripcionResponse> inscripciones = inscripcionService.getInscripcionesByUsuarioId(usuarioId);
        return ResponseEntity.ok(inscripciones);
    }

    @GetMapping("/actividad/{actividadId}")
    public ResponseEntity<List<InscripcionResponse>> getInscripcionesByActividadId(@PathVariable Integer actividadId) {
        List<InscripcionResponse> inscripciones = inscripcionService.getInscripcionesByActividadId(actividadId);
        return ResponseEntity.ok(inscripciones);
    }
}
