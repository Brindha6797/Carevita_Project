package com.example.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.demo.model.Hospital;
import com.example.demo.repository.HospitalRepository;

@Service
public class HospitalService {

    private final HospitalRepository repository;

    public HospitalService(HospitalRepository repository) {
        this.repository = repository;
    }

    public Hospital saveHospital(Hospital hospital) {
        return repository.save(hospital);
    }

    public List<Hospital> getAllHospitals() {
        return repository.findAll();
    }

    public List<Hospital> getHospitalsByLocation(String location) {
        return repository.findByLocationContainingIgnoreCase(location);
    }

    public List<Hospital> searchHospitals(String query) {
        return repository.findByNameContainingIgnoreCase(query);
    }
}
