package com.example.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.demo.model.Appointment;
import com.example.demo.model.User;
import com.example.demo.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment bookAppointment(Appointment appointment) {
        // Check if slot is already taken
        List<Appointment> existing = repository.findByDoctorAndAppointmentDateAndAppointmentTime(
                appointment.getDoctor(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime());

        if (!existing.isEmpty()) {
            throw new RuntimeException("This slot is already booked. Please choose another time.");
        }

        if (appointment.getStatus() == null) {
            appointment.setStatus("BOOKED");
        }
        return repository.save(appointment);
    }

    public List<String> getBookedSlots(Long doctorId, String date) {
        // This is a helper for the frontend to show which slots are taken
        // Implementation depends on how we pass doctorId (need Doctor object)
        return null; // Placeholder
    }

    public List<Appointment> getAllAppointments() {
        return repository.findAll();
    }

    public List<Appointment> getAppointmentsByPatient(User patient) {
        return repository.findByPatient(patient);
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return repository.save(appointment);
    }
}
