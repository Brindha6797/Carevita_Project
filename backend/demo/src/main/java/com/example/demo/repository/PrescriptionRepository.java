package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByPatientIdAndStatus(Long patientId, String status);

    List<Prescription> findByDoctorIdAndStatus(Long doctorId, String status);

    List<Prescription> findByPatientIdOrderByPrescriptionDateDesc(Long patientId);
}
