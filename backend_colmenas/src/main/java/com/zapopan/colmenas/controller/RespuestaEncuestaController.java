package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.respuestaencuesta.RespuestaEncuestaRequest;
import com.zapopan.colmenas.dto.respuestaencuesta.RespuestaEncuestaResponse;
import com.zapopan.colmenas.service.RespuestaEncuestaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/respuestas-encuesta")
public class RespuestaEncuestaController {

    private final RespuestaEncuestaService respuestaEncuestaService;

    public RespuestaEncuestaController(RespuestaEncuestaService respuestaEncuestaService) {
        this.respuestaEncuestaService = respuestaEncuestaService;
    }

    @GetMapping
    public ResponseEntity<List<RespuestaEncuestaResponse>> getAllRespuestasEncuesta() {
        List<RespuestaEncuestaResponse> respuestas = respuestaEncuestaService.getAllRespuestasEncuesta();
        return ResponseEntity.ok(respuestas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RespuestaEncuestaResponse> getRespuestaEncuestaById(@PathVariable Integer id) {
        RespuestaEncuestaResponse respuesta = respuestaEncuestaService.getRespuestaEncuestaById(id);
        return ResponseEntity.ok(respuesta);
    }

    @PostMapping
    public ResponseEntity<RespuestaEncuestaResponse> createRespuestaEncuesta(@Valid @RequestBody RespuestaEncuestaRequest respuestaEncuestaRequest) {
        RespuestaEncuestaResponse createdRespuesta = respuestaEncuestaService.createRespuestaEncuesta(respuestaEncuestaRequest);
        return new ResponseEntity<>(createdRespuesta, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRespuestaEncuesta(@PathVariable Integer id) {
        respuestaEncuestaService.deleteRespuestaEncuesta(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/encuesta/{encuestaId}")
    public ResponseEntity<List<RespuestaEncuestaResponse>> getRespuestasByEncuestaId(@PathVariable Integer encuestaId) {
        List<RespuestaEncuestaResponse> respuestas = respuestaEncuestaService.getRespuestasByEncuestaId(encuestaId);
        return ResponseEntity.ok(respuestas);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<RespuestaEncuestaResponse>> getRespuestasByUsuarioId(@PathVariable Integer usuarioId) {
        List<RespuestaEncuestaResponse> respuestas = respuestaEncuestaService.getRespuestasByUsuarioId(usuarioId);
        return ResponseEntity.ok(respuestas);
    }
}
