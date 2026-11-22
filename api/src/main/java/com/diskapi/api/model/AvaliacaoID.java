package com.diskapi.api.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class AvaliacaoID implements Serializable {

    private UUID avaliadorId;
    private UUID avaliadoId;
    private UUID matchId;
}
