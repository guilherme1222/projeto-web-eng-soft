package com.diskapi.api.service;

import com.diskapi.api.dto.MatchDTO;
import com.diskapi.api.model.Match;
import com.diskapi.api.repositories.CourtRepository;
import com.diskapi.api.repositories.MatchRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MatchService {
    private final MatchRepository repository;
    private final CourtRepository courtRepository;

    public MatchService(MatchRepository repository, CourtRepository courtRepository) {
        this.repository = repository;
        this.courtRepository = courtRepository;
    }

    public List<MatchDTO.MatchResponseDTO> getAll() {
        return repository.findAll().stream().map(MatchDTO.MatchResponseDTO::new).toList();
    }

    public MatchDTO.MatchResponseDTO getById(UUID id) {
        return matchToDTO(repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Partida não encontrada.")));
    }

    public List<MatchDTO.MatchResponseDTO> buscarPartidasDoJogador(UUID userId) {
        // Se usar a opção Native Query no repository, mude a chamada abaixo
        return listMatchToDTO(repository.findByUserIdNative(userId));
    }

    public Match create(MatchDTO.PostMatchDTO data) {
        Match match = new Match();
        match.setCourt(courtRepository.findById(data.courtId())
                .orElseThrow(() -> new IllegalArgumentException("Quadra não encontrada.")));
        match.setDate(data.date());
        match.setStatus(data.status());
        match.setMatchCreateDate(Timestamp.from(Instant.now()));
        return repository.save(match);
    }

    public Match update(UUID id, MatchDTO.PostMatchDTO data) {
        Match match = repository.findById(id).orElseThrow();
        match.setCourt(courtRepository.findById(data.courtId())
                .orElseThrow(() -> new IllegalArgumentException("Quadra não encontrada.")));
        match.setDate(data.date());
        match.setStatus(data.status());
        return repository.save(match);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Partida não encontrada.");
        }
        repository.deleteById(id);
    }

    public MatchDTO.MatchResponseDTO matchToDTO(Match m){ return new MatchDTO.MatchResponseDTO(m);}
    public List<MatchDTO.MatchResponseDTO> listMatchToDTO(List<Match> l ){
        return l.stream().map(this::matchToDTO).toList();
    }

}
