package com.diskapi.api.repositories;

import com.diskapi.api.model.SportComplex;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SportComplexRespository extends JpaRepository<SportComplex, UUID> {
}
