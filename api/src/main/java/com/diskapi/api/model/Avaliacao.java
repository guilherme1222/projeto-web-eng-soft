package com.diskapi.api.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Avaliacao {
    @EmbeddedId
    private AvaliacaoID id;

    private LocalDateTime dataAvaliacao;
    private float nota;
    private String comentario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("avaliadorId") // Referencia o id de avaliador dentro de AvaliacaoID
    @JoinColumn(name = "avaliador_id")
    private Player avaliador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "avaliadoId", referencedColumnName = "user_id", insertable = false, updatable = false),
            @JoinColumn(name = "matchId", referencedColumnName = "match_id", insertable = false, updatable = false)
    })
    private Participation participation;


}
