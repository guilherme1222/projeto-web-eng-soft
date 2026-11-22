package com.diskapi.api.model;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "players")
public class Player {
    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;


    @OneToMany(mappedBy = "player")
    private List<Participation> participations;


    @Column(name = "media_desempenho")
    private double mediaDesempenho = 0.0;

    @Column(name = "total_partidas_avaliadas")
    private int totalPartidasAvaliadas = 0;

}