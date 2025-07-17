package com.zapopan.colmenas.controller;

import com.zapopan.colmenas.dto.colmena.ColmenaRequest;
import com.zapopan.colmenas.dto.colmena.ColmenaResponse;
import com.zapopan.colmenas.service.ColmenaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colmenas")
public class ColmenaController {

    private final ColmenaService colmenaService;

    public ColmenaController(ColmenaService colmenaService) {
        this.colmenaService = colmenaService;
    }

    @GetMapping
    public ResponseEntity<List<ColmenaResponse>> getAllColmenas() {
        List<ColmenaResponse> colmenas = colmenaService.getAllColmenas();
        return ResponseEntity.ok(colmenas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColmenaResponse> getColmenaById(@PathVariable Integer id) {
        ColmenaResponse colmena = colmenaService.getColmenaById(id);
        return ResponseEntity.ok(colmena);
    }

    @PostMapping
    public ResponseEntity<ColmenaResponse> createColmena(@Valid @RequestBody ColmenaRequest colmenaRequest) {
        ColmenaResponse createdColmena = colmenaService.createColmena(colmenaRequest);
        return new ResponseEntity<>(createdColmena, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ColmenaResponse> updateColmena(@PathVariable Integer id, @Valid @RequestBody ColmenaRequest colmenaRequest) {
        ColmenaResponse updatedColmena = colmenaService.updateColmena(id, colmenaRequest);
        return ResponseEntity.ok(updatedColmena);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColmena(@PathVariable Integer id) {
        colmenaService.deleteColmena(id);
        return ResponseEntity.noContent().build();
    }
}
