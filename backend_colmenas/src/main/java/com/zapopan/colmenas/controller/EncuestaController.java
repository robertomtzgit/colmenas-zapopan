package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.encuesta.EncuestaRequest;
import com.zapopan.colmenas.dto.encuesta.EncuestaResponse;
import com.zapopan.colmenas.service.EncuestaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encuestas")
public class EncuestaController {

    private final EncuestaService encuestaService;

    public EncuestaController(EncuestaService encuestaService) {
        this.encuestaService = encuestaService;
    }

    @GetMapping
    public ResponseEntity<List<EncuestaResponse>> getAllEncuestas() {
        List<EncuestaResponse> encuestas = encuestaService.getAllEncuestas();
        return ResponseEntity.ok(encuestas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EncuestaResponse> getEncuestaById(@PathVariable Integer id) {
        EncuestaResponse encuesta = encuestaService.getEncuestaById(id);
        return ResponseEntity.ok(encuesta);
    }

    @PostMapping
    public ResponseEntity<EncuestaResponse> createEncuesta(@Valid @RequestBody EncuestaRequest encuestaRequest) {
        EncuestaResponse createdEncuesta = encuestaService.createEncuesta(encuestaRequest);
        return new ResponseEntity<>(createdEncuesta, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EncuestaResponse> updateEncuesta(@PathVariable Integer id, @Valid @RequestBody EncuestaRequest encuestaRequest) {
        EncuestaResponse updatedEncuesta = encuestaService.updateEncuesta(id, encuestaRequest);
        return ResponseEntity.ok(updatedEncuesta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEncuesta(@PathVariable Integer id) {
        encuestaService.deleteEncuesta(id);
        return ResponseEntity.noContent().build();
    }
}
