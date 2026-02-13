package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Doctor;
import com.example.demo.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository repository;

    public DoctorService(DoctorRepository repository) {
        this.repository = repository;
    }

    public Doctor saveDoctor(Doctor doctor) {
        return repository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return repository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }

    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor doctor = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setName(updatedDoctor.getName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setHospitalName(updatedDoctor.getHospitalName());
        doctor.setLocation(updatedDoctor.getLocation());

        return repository.save(doctor);
    }

    public List<Doctor> searchDoctors(String query) {
        return repository.findBySpecializationContainingIgnoreCase(query);
    }

    public List<Doctor> getDoctorsByLocation(String location) {
        return repository.findByLocationContainingIgnoreCase(location);
    }

    public void deleteDoctor(Long id) {
        repository.deleteById(id);
    }

}
