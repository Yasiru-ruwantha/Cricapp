package com.crickapp.backend.repository;

import com.crickapp.backend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    List<Player> findByTeamIsNullAndNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Player> findByTeamIsNullOrderByNameAsc();

    List<Player> findByNameContainingIgnoreCaseOrderByNameAsc(String name);

    List<Player> findAllByOrderByNameAsc();
}
