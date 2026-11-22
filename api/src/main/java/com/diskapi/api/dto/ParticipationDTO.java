package com.diskapi.api.dto;

import com.diskapi.api.model.Participation;

public class ParticipationDTO {
    public record ParticipationResponseDTO(
            String playerName,
            String quotaValue,
            String paymentStatus
    ) {
        public ParticipationResponseDTO(Participation p) {
            this(
                    p.getPlayer().getUser().getName(), // Ajuste aqui conforme seu modelo de Player
                    p.getQuotaValue(),
                    p.getPaymentStatus()
            );
        }
    }
}
