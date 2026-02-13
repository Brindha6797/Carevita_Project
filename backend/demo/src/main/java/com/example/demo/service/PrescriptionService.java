package com.example.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.example.demo.model.Prescription;
import com.example.demo.repository.PrescriptionRepository;
import com.example.demo.exception.ResourceNotFoundException;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repository;

    public PrescriptionService(PrescriptionRepository repository) {
        this.repository = repository;
    }

    public Prescription savePrescription(Prescription prescription) {
        return repository.save(prescription);
    }

    public List<Prescription> getAllPrescriptions() {
        return repository.findAll();
    }

    public Prescription getPrescriptionById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
    }

    public List<Prescription> getPatientPrescriptions(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<Prescription> getDoctorPrescriptions(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    public List<Prescription> getActivePatientPrescriptions(Long patientId) {
        return repository.findByPatientIdAndStatus(patientId, "ACTIVE");
    }

    public Prescription updatePrescription(Long id, Prescription prescriptionDetails) {
        Prescription prescription = getPrescriptionById(id);

        prescription.setMedicine(prescriptionDetails.getMedicine());
        prescription.setDosage(prescriptionDetails.getDosage());
        prescription.setFrequency(prescriptionDetails.getFrequency());
        prescription.setDuration(prescriptionDetails.getDuration());
        prescription.setInstructions(prescriptionDetails.getInstructions());
        prescription.setNotes(prescriptionDetails.getNotes());
        prescription.setValidUntil(prescriptionDetails.getValidUntil());
        prescription.setStatus(prescriptionDetails.getStatus());

        return repository.save(prescription);
    }

    public Prescription updateStatus(Long id, String status) {
        Prescription prescription = getPrescriptionById(id);
        prescription.setStatus(status);
        return repository.save(prescription);
    }

    public void deletePrescription(Long id) {
        Prescription prescription = getPrescriptionById(id);
        repository.delete(prescription);
    }
}
