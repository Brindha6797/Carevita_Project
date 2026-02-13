package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
}
