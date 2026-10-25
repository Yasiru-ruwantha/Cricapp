package com.crickapp.backend.repository;

import com.crickapp.backend.model.Team;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    @EntityGraph(attributePaths = {"captain", "players"})
    List<Team> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    @EntityGraph(attributePaths = {"captain", "players"})
    List<Team> findAllByOrderByNameAsc();

    @EntityGraph(attributePaths = {"players", "captain", "viceCaptain"})
    @Query("SELECT t FROM Team t WHERE t.id = :id")
    Optional<Team> findByIdWithDetails(@Param("id") Long id);
}
