package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Doctor;
import com.example.demo.service.DoctorService;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return service.saveDoctor(doctor);
    }

    @GetMapping("/all")
    public List<Doctor> getAll() {
        return service.getAllDoctors();
    }

    @GetMapping("/search")
    public List<Doctor> search(@RequestParam String query) {
        return service.searchDoctors(query);
    }

    @GetMapping("/location")
    public List<Doctor> getByLocation(@RequestParam String location) {
        return service.getDoctorsByLocation(location);
    }

    @GetMapping("/{id}")
    public Doctor getById(@PathVariable Long id) {
        return service.getDoctorById(id);
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        return service.updateDoctor(id, doctor);
    }

    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        service.deleteDoctor(id);
        return "Doctor deleted successfully";
    }
}
