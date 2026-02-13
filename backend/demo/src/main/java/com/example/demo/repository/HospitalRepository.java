package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByLocationContainingIgnoreCase(String location);

    List<Hospital> findByNameContainingIgnoreCase(String name);
}
