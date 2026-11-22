package com.diskapi.api.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class ParticipationID implements Serializable {
    private UUID matchId;
    private UUID userId;
}
