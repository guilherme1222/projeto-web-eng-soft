package com.diskapi.api.controller;

import com.diskapi.api.dto.CourtDTO;
import com.diskapi.api.dto.SportComplexDTO;
import com.diskapi.api.dto.SportComplexDTO.*;
import com.diskapi.api.model.SportComplex;
import com.diskapi.api.service.SportComplexService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/complex")
public class SportComplexController {
    private final SportComplexService service;

    public SportComplexController(SportComplexService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SportComplexResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SportComplexResponseDTO> getComplex(@PathVariable UUID id) {
        SportComplexResponseDTO complex = service.getById(id);
        return ResponseEntity.ok(complex);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid PostSportComplexDTO data) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.create(data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody @Valid PostSportComplexDTO data) {
        try {
            SportComplexResponseDTO response = new SportComplexResponseDTO(service.update(id, data));
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
