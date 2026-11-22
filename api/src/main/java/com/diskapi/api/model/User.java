package com.diskapi.api.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.diskapi.api.dto.UserDTO;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(
        name="USERS",
        uniqueConstraints = @UniqueConstraint(
                name = "UNIQUE_USERNAME",
                columnNames = {"username"}
        )
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String cpf;

    @Column(unique = true)
    private String username;
    private String name;

    @Column(unique = true)
    private String email;
    private String password;
    
    private LocalDate birthday;
    private LocalDateTime userCreatedDate;

    public User(String username, String cpf, String name, String email, String password, LocalDate birthday) {
        this.username = username;
        this.cpf = cpf;
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthday = birthday;

        this.userCreatedDate = LocalDateTime.now();
    }
    
    public User(UserDTO.PostUserDTO data) {
        this.username = data.username();
        this.cpf = data.cpf();
        this.name = data.name();
        this.email = data.email();
        this.password = data.password();
        this.birthday = LocalDate.parse(data.birthday());

        this.userCreatedDate = LocalDateTime.now();
    }

    public User(){
    }
}
