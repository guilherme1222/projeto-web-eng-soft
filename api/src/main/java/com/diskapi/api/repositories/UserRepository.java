package com.diskapi.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.diskapi.api.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    public boolean existsByUsername(String username);
    public Optional<User> findByUsername(String username);
}
