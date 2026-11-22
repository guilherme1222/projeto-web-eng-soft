package com.diskapi.api.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Participation {
    @EmbeddedId
    private ParticipationID id;

    private String quotaValue;
    private String paymentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId") // Conecta com o 'userId' do ParticipationID
    @JoinColumn(name = "user_id")
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("matchId") // Conecta com o 'matchId' do ParticipationID
    @JoinColumn(name = "match_id")
    private Match match;

    @OneToMany(mappedBy = "participation")
    private List<Avaliacao> avaliacoes;
}
