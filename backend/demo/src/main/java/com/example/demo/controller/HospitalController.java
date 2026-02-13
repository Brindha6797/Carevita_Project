package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Hospital;
import com.example.demo.service.HospitalService;

@RestController
@RequestMapping("/hospitals")
public class HospitalController {

    private final HospitalService service;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    @PostMapping
    public Hospital addHospital(@RequestBody Hospital hospital) {
        return service.saveHospital(hospital);
    }

    @GetMapping("/all")
    public List<Hospital> getAll() {
        return service.getAllHospitals();
    }

    @GetMapping("/search")
    public List<Hospital> search(@RequestParam String query) {
        return service.searchHospitals(query);
    }

    @GetMapping("/location")
    public List<Hospital> getByLocation(@RequestParam String location) {
        return service.getHospitalsByLocation(location);
    }
}
