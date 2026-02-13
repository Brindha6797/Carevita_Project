package com.example.demo.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Appointment;
import com.example.demo.model.User;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);

    List<Appointment> findByDoctorAndAppointmentDateAndAppointmentTime(com.example.demo.model.Doctor doctor,
            String appointmentDate, String appointmentTime);

    List<Appointment> findByDoctorAndAppointmentDate(com.example.demo.model.Doctor doctor, String appointmentDate);
}
