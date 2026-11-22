package com.diskapi.api.repositories;

import com.diskapi.api.model.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CourtRepository extends JpaRepository<Court , UUID> {
}
