package com.diskapi.api.model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String status;

    @ManyToOne
    private Court court;

    private LocalDateTime date;
    private Timestamp matchCreateDate;

    @OneToMany(mappedBy = "match")
    private List<Participation> participants;
}
