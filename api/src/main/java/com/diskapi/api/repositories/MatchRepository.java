package com.diskapi.api.repositories;

import com.diskapi.api.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MatchRepository extends JpaRepository<Match, UUID> {
    @Query(value = "SELECT m.* FROM match m JOIN participation p ON m.id = p.match_id WHERE p.user_id = :userId", nativeQuery = true)
   List<Match> findByUserIdNative(@Param("userId") UUID userId);

}
