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
import com.example.demo.service.NotificationService;
import java.security.Principal;

import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService service;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public AppointmentController(AppointmentService service, UserRepository userRepository,
            DoctorRepository doctorRepository, AppointmentRepository appointmentRepository,
            NotificationService notificationService) {
        this.service = service;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    @PostMapping("/book")
    public Appointment book(@RequestBody Map<String, Object> data, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(user);

        // hospitalId may be null for direct-doctor bookings
        if (data.get("hospitalId") != null && !data.get("hospitalId").toString().equals("null")) {
            appointment.setHospitalId(Long.valueOf(data.get("hospitalId").toString()));
        }

        // Set doctor if provided (BookingModal sends: doctor: { id: X })
        try {
            Object doctorObj = data.get("doctor");
            if (doctorObj instanceof java.util.Map) {
                Object doctorId = ((java.util.Map<?, ?>) doctorObj).get("id");
                if (doctorId != null) {
                    doctorRepository.findById(Long.valueOf(doctorId.toString()))
                            .ifPresent(appointment::setDoctor);
                }
            }
        } catch (Exception ignored) {
        }

        if (data.get("problem") != null) {
            appointment.setProblem(data.get("problem").toString());
        }
        if (data.get("appointmentDate") != null) {
            appointment.setAppointmentDate(data.get("appointmentDate").toString());
        }
        if (data.get("appointmentTime") != null) {
            appointment.setAppointmentTime(data.get("appointmentTime").toString());
        }

        appointment.setStatus("PENDING");

        Appointment saved = service.bookAppointment(appointment);
        notificationService.createNotification(user,
                "Your appointment request has been submitted and is PENDING confirmation.", "APPOINTMENT");
        return saved;
    }

    // New endpoint matching the frontend RequestAppointmentModal
    @PostMapping("/request")
    public Appointment request(@RequestBody Map<String, Object> data, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(user);
        appointment.setHospitalId(Long.valueOf(data.get("hospitalId").toString()));

        // Optional doctorId
        if (data.get("doctorId") != null && !data.get("doctorId").toString().equals("null")) {
            try {
                Long doctorId = Long.valueOf(data.get("doctorId").toString());
                doctorRepository.findById(doctorId).ifPresent(appointment::setDoctor);
            } catch (Exception ignored) {
            }
        }

        // Set reason/problem
        if (data.get("reason") != null) {
            appointment.setProblem(data.get("reason").toString());
        }
        // Set date and time if provided
        if (data.get("appointmentDate") != null) {
            appointment.setAppointmentDate(data.get("appointmentDate").toString());
        }
        if (data.get("appointmentTime") != null) {
            appointment.setAppointmentTime(data.get("appointmentTime").toString());
        }
        if (data.get("dayOfWeek") != null) {
            appointment.setDayOfWeek(data.get("dayOfWeek").toString());
        }

        appointment.setStatus("PENDING");

        Appointment saved = service.bookAppointment(appointment);
        notificationService.createNotification(user,
                "Your appointment request has been submitted. Reception will confirm your slot shortly.",
                "APPOINTMENT");
        return saved;
    }

    @GetMapping("/hospital/{hospitalId}/pending")
    public List<Appointment> getPending(@PathVariable("hospitalId") Long hospitalId) {
        return service.getPendingAppointmentsByHospital(hospitalId);
    }

    @PutMapping("/{id}/confirm")
    public Appointment confirm(@PathVariable("id") Long id, @RequestBody Map<String, Object> data) {
        Long doctorId = Long.valueOf(data.get("doctorId").toString());
        String date = data.get("date").toString();
        String time = data.get("time").toString();

        com.example.demo.model.Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment confirmed = service.confirmAppointment(id, doctor, date, time);
        notificationService.createNotification(confirmed.getPatient(),
                "Appointment Confirmed: You have a slot with Dr. " + doctor.getName() + " on " + date + " at " + time,
                "APPOINTMENT");
        return confirmed;
    }

    @GetMapping("/my")
    public List<Appointment> getMyAppointments(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return service.getAppointmentsByPatient(user);
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable("id") Long id, @RequestBody Map<String, String> statusMap) {
        return service.updateStatus(id, statusMap.get("status"));
    }

    @GetMapping("/doctor")
    public List<Appointment> getDoctorAppointments(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        com.example.demo.model.Doctor doctor = doctorRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for this user"));

        return appointmentRepository.findByDoctorAndAppointmentDate(doctor, java.time.LocalDate.now().toString());
    }

    @GetMapping("/all")
    public List<Appointment> getAll() {
        return service.getAllAppointments();
    }

}
