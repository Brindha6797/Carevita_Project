package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByLocationContainingIgnoreCase(String location);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);

    List<Doctor> findByHospitalNameContainingIgnoreCase(String hospitalName);

    java.util.Optional<Doctor> findByEmail(String email);
}
