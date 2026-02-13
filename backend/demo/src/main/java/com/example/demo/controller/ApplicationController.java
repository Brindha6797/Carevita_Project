package com.example.demo.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Application;
import com.example.demo.service.ApplicationService;

@RestController
@RequestMapping("/apply")
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public Application save(@RequestBody Application application) {
        return service.saveApplication(application);
    }

    @GetMapping("/all")
    public List<Application> getAll() {
        return service.getAllApplications();
    }
}
