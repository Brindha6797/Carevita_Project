package com.example.demo.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Prescription;
import com.example.demo.service.PrescriptionService;

@RestController
@RequestMapping("/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService service;
    private final com.example.demo.repository.UserRepository userRepository;
    private final com.example.demo.repository.DoctorRepository doctorRepository;

    public PrescriptionController(PrescriptionService service,
            com.example.demo.repository.UserRepository userRepository,
            com.example.demo.repository.DoctorRepository doctorRepository) {
        this.service = service;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Prescription>> getMyPrescriptions(java.security.Principal principal) {
        com.example.demo.model.User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(service.getPatientPrescriptions(user.getId()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadPrescription(@PathVariable Long id) {
        Prescription prescription = service.getPrescriptionById(id);
        StringBuilder content = new StringBuilder();
        content.append("CareVita Prescription\n");
        content.append("=======================\n");
        content.append("Patient: ").append(prescription.getPatient().getFullName()).append("\n");
        content.append("Doctor: ").append(prescription.getDoctor().getName()).append("\n");
        content.append("Date: ").append(prescription.getPrescriptionDate()).append("\n\n");
        content.append("Medicine: ").append(prescription.getMedicine()).append("\n");
        content.append("Dosage: ").append(prescription.getDosage()).append("\n");
        content.append("Instructions: ").append(prescription.getInstructions()).append("\n");

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=prescription_" + id + ".txt")
                .body(content.toString().getBytes());
    }

    @PostMapping("/add")
    public ResponseEntity<Prescription> addPrescription(@RequestBody java.util.Map<String, Object> data,
            java.security.Principal principal) {
        com.example.demo.model.User patient = userRepository.findById(Long.valueOf(data.get("patientId").toString()))
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        com.example.demo.model.User doctorUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Doctor user not found"));

        com.example.demo.model.Doctor doctorProfile = doctorRepository.findByEmail(doctorUser.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctorProfile);
        prescription.setMedicine(data.get("details").toString());
        prescription.setInstructions("Consultation note: " + data.get("details").toString());

        return ResponseEntity.ok(service.savePrescription(prescription));
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getPrescriptions() {
        return ResponseEntity.ok(service.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPrescriptionById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getPatientPrescriptions(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getDoctorPrescriptions(@PathVariable Long doctorId) {
        return ResponseEntity.ok(service.getDoctorPrescriptions(doctorId));
    }

    @GetMapping("/patient/{patientId}/active")
    public ResponseEntity<List<Prescription>> getActivePatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(service.getActivePatientPrescriptions(patientId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id,
            @RequestBody Prescription prescription) {
        return ResponseEntity.ok(service.updatePrescription(id, prescription));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Prescription> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        service.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}
