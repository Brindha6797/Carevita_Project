package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.Appointment;
import com.example.demo.model.User;
import com.example.demo.service.AppointmentService;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.AppointmentRepository;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService service;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public AppointmentController(AppointmentService service, UserRepository userRepository,
            DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        this.service = service;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @PostMapping("/book")
    public Appointment book(@RequestBody Appointment appointment, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        appointment.setPatient(user);
        return service.bookAppointment(appointment);
    }

    @GetMapping("/my")
    public List<Appointment> getMyAppointments(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return service.getAppointmentsByPatient(user);
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        return service.updateStatus(id, statusMap.get("status"));
    }

    @GetMapping("/doctor")
    public List<Appointment> getDoctorAppointments(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the doctor record associated with this user email
        com.example.demo.model.Doctor doctor = doctorRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for this user"));

        return appointmentRepository.findByDoctorAndAppointmentDate(doctor, java.time.LocalDate.now().toString()); // For
                                                                                                                   // now
                                                                                                                   // just
                                                                                                                   // today's
    }

    @GetMapping("/all")
    public List<Appointment> getAll() {
        return service.getAllAppointments();
    }
}
