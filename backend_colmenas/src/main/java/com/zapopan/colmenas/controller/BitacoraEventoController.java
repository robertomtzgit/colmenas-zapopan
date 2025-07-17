package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.bitacoraevento.BitacoraEventoRequest;
import com.zapopan.colmenas.dto.bitacoraevento.BitacoraEventoResponse;
import com.zapopan.colmenas.service.BitacoraEventoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bitacora-eventos")
public class BitacoraEventoController {

    private final BitacoraEventoService bitacoraEventoService;

    public BitacoraEventoController(BitacoraEventoService bitacoraEventoService) {
        this.bitacoraEventoService = bitacoraEventoService;
    }

    @GetMapping
    public ResponseEntity<List<BitacoraEventoResponse>> getAllBitacoraEventos() {
        List<BitacoraEventoResponse> eventos = bitacoraEventoService.getAllBitacoraEventos();
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BitacoraEventoResponse> getBitacoraEventoById(@PathVariable Integer id) {
        BitacoraEventoResponse evento = bitacoraEventoService.getBitacoraEventoById(id);
        return ResponseEntity.ok(evento);
    }

    @PostMapping
    public ResponseEntity<BitacoraEventoResponse> createBitacoraEvento(@Valid @RequestBody BitacoraEventoRequest bitacoraEventoRequest) {
        BitacoraEventoResponse createdEvento = bitacoraEventoService.createBitacoraEvento(bitacoraEventoRequest);
        return new ResponseEntity<>(createdEvento, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBitacoraEvento(@PathVariable Integer id) {
        bitacoraEventoService.deleteBitacoraEvento(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<BitacoraEventoResponse>> getBitacoraEventosByUsuarioId(@PathVariable Integer usuarioId) {
        List<BitacoraEventoResponse> eventos = bitacoraEventoService.getBitacoraEventosByUsuarioId(usuarioId);
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/modulo/{modulo}")
    public ResponseEntity<List<BitacoraEventoResponse>> getBitacoraEventosByModulo(@PathVariable String modulo) {
        List<BitacoraEventoResponse> eventos = bitacoraEventoService.getBitacoraEventosByModulo(modulo);
        return ResponseEntity.ok(eventos);
    }
}
