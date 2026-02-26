package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Hospital;

import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.HospitalRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.services.UserDetailsImpl;
import com.example.demo.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/hospitals")
public class HospitalController {

    @Autowired
    private HospitalService service;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Hospital addHospital(@RequestBody Hospital hospital) {
        return service.saveHospital(hospital);
    }

    @GetMapping("/all")
    public List<Hospital> getAll() {
        return service.getAllHospitals();
    }

    @GetMapping("/search")
    public List<Hospital> search(@RequestParam("query") String query) {
        return service.searchHospitals(query);
    }

    @GetMapping("/location")
    public List<Hospital> getByLocation(@RequestParam("location") String location) {
        return service.getHospitalsByLocation(location);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyHospital() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Long hospitalId = userDetails.getHospitalId();
        if (hospitalId == null) {
            return ResponseEntity.badRequest().body("No hospital associated with this account");
        }
        return hospitalRepository.findById(hospitalId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me/doctors")
    public ResponseEntity<?> getMyDoctors() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Long hospitalId = userDetails.getHospitalId();
        if (hospitalId == null) {
            return ResponseEntity.badRequest().body("No hospital associated with this account");
        }
        return ResponseEntity.ok(doctorRepository.findByHospitalId(hospitalId));
    }

    @GetMapping("/me/receptionists")
    public ResponseEntity<?> getMyReceptionists() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Long hospitalId = userDetails.getHospitalId();
        if (hospitalId == null) {
            return ResponseEntity.badRequest().body("No hospital associated with this account");
        }
        return ResponseEntity.ok(userRepository.findAll().stream()
                .filter(u -> hospitalId.equals(u.getHospitalId())
                        && u.getRoles().contains(com.example.demo.model.Role.ROLE_RECEPTIONIST))
                .toList());
    }
}
