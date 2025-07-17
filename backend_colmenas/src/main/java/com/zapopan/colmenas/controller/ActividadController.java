package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.actividad.ActividadRequest;
import com.zapopan.colmenas.dto.actividad.ActividadResponse;
import com.zapopan.colmenas.service.ActividadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    private final ActividadService actividadService;

    public ActividadController(ActividadService actividadService) {
        this.actividadService = actividadService;
    }

    @GetMapping
    public ResponseEntity<List<ActividadResponse>> getAllActividades() {
        List<ActividadResponse> actividades = actividadService.getAllActividades();
        return ResponseEntity.ok(actividades);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActividadResponse> getActividadById(@PathVariable Integer id) {
        ActividadResponse actividad = actividadService.getActividadById(id);
        return ResponseEntity.ok(actividad);
    }

    @PostMapping
    public ResponseEntity<ActividadResponse> createActividad(@Valid @RequestBody ActividadRequest actividadRequest) {
        ActividadResponse createdActividad = actividadService.createActividad(actividadRequest);
        return new ResponseEntity<>(createdActividad, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActividadResponse> updateActividad(@PathVariable Integer id, @Valid @RequestBody ActividadRequest actividadRequest) {
        ActividadResponse updatedActividad = actividadService.updateActividad(id, actividadRequest);
        return ResponseEntity.ok(updatedActividad);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActividad(@PathVariable Integer id) {
        actividadService.deleteActividad(id);
        return ResponseEntity.noContent().build();
    }
}
