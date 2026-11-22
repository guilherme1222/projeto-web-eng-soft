package com.diskapi.api.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
public class Manager {
    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "manager", fetch = FetchType.LAZY)
    private List<SportComplex> managedComplexes;

    @Column(name = "cnpj")
    private String cnpj;

    @Column(name = "chave_pix")
    private String chavePix;

}