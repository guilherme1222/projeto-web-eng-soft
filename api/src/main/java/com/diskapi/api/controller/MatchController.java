package com.diskapi.api.controller;

import com.diskapi.api.dto.MatchDTO;
import com.diskapi.api.model.Match;
import com.diskapi.api.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/match")
public class MatchController {
    private final MatchService service;

    public MatchController(MatchService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<com.diskapi.api.dto.MatchDTO.MatchResponseDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MatchDTO.MatchResponseDTO>> listarPartidasDoJogador(@PathVariable UUID userId) {
        List<MatchDTO.MatchResponseDTO> partidas = service.buscarPartidasDoJogador(userId);
        // Retorna 200 OK com a lista de partidas (idealmente convertida para DTO)
        return ResponseEntity.ok(partidas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid MatchDTO.PostMatchDTO data) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.create(data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody @Valid MatchDTO.PostMatchDTO data) {
        try {
            return ResponseEntity.ok(service.update(id, data));
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
