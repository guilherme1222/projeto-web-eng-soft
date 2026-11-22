package com.diskapi.api.model;

import com.diskapi.api.common.Address;
import com.diskapi.api.dto.CourtDTO;

import com.diskapi.api.enums.CourtType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
public class Court {
    @Id
    private UUID id;

    private String name;
    private CourtType type;
    private float hourValue;

    @ManyToOne
    @JoinColumn(name = "complex_id")
    SportComplex sportComplex;
}
