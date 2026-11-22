package com.diskapi.api.model;

import com.diskapi.api.common.Address;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class SportComplex {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String cnpj;
    private String name;

    @Embedded
    private Address address;

    @OneToMany(mappedBy = "sportComplex",
                fetch = FetchType.LAZY)
    private List<Court> courts = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id") // Cria a coluna FK exata exigida pelo SQL
    private Manager manager;

    public void addCourt(Court newCourt) {
        this.courts.add(newCourt);
        newCourt.setSportComplex(this);
    }
}
