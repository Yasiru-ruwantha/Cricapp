package com.crickapp.backend.repository;

import com.crickapp.backend.model.Ball;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BallRepository extends JpaRepository<Ball, Long> {
    List<Ball> findByInningIdOrderByIdDesc(Long inningId);
}
