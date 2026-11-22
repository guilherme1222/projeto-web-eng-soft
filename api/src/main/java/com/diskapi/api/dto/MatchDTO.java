package com.diskapi.api.dto;

import com.diskapi.api.model.Match;
import jakarta.validation.constraints.NotNull;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


public class MatchDTO {
    // DTO usado para criar ou atualizar (POST/PUT)
    public record PostMatchDTO(
            @NotNull UUID courtId,
            @NotNull LocalDateTime date,
            @NotNull String status
    ){}

    // DTO usado para retornar dados ao frontend (GET)
    public record MatchResponseDTO(
            UUID id,
            String status,
            String courtName,
            LocalDateTime date,
            Timestamp matchCreateDate,
            List<ParticipationDTO.ParticipationResponseDTO> participants
    ) {
        public MatchResponseDTO(Match m) {
            this(
                m.getId(),
                m.getStatus(),
                m.getCourt().getName(),
                m.getDate(),
                m.getMatchCreateDate(),
                // Converte a lista de entidades Participation para a lista de DTOs
                m.getParticipants() != null ? 
                    m.getParticipants().stream()
                        .map(ParticipationDTO.ParticipationResponseDTO::new)
                        .collect(Collectors.toList()) :
                    null
            );
        }
    }
}