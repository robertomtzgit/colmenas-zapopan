package com.zapopan.colmenas.repository;

import com.zapopan.colmenas.model.Colmena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColmenaRepository extends JpaRepository<Colmena, Integer> {
    List<Colmena> findByActivaTrue();
}
