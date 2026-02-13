package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.model.Doctor;
import com.example.demo.model.Hospital;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.HospitalRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(DoctorRepository doctorRepository, HospitalRepository hospitalRepository) {
        return args -> {
            if (doctorRepository.count() == 0) {
                Doctor d1 = new Doctor();
                d1.setName("Dr. Sarah Wilson");
                d1.setSpecialization("Cardiologist");
                d1.setHospitalName("City General Hospital");
                d1.setLocation("New York");
                d1.setExperience(12);
                d1.setBio("Specialist in heart health and preventative care.");
                d1.setConsultationFee(150.0);
                d1.setAvailability("Mon, Wed, Fri (9 AM - 4 PM)");
                doctorRepository.save(d1);

                Doctor d2 = new Doctor();
                d2.setName("Dr. James Miller");
                d2.setSpecialization("Dermatologist");
                d2.setHospitalName("Skin & Care Clinic");
                d2.setLocation("Chicago");
                d2.setExperience(8);
                d2.setBio("Expert in cosmetic and medical dermatology.");
                d2.setConsultationFee(100.0);
                d2.setAvailability("Tue, Thu (10 AM - 6 PM)");
                doctorRepository.save(d2);

                Doctor d3 = new Doctor();
                d3.setName("Dr. Elena Vance");
                d3.setSpecialization("Neurologist");
                d3.setHospitalName("Metro Health Center");
                d3.setLocation("New York");
                d3.setExperience(15);
                d3.setBio("Focused on cognitive disorders and neuro-rehabilitation.");
                d3.setConsultationFee(200.0);
                d3.setAvailability("Mon-Fri (8 AM - 12 PM)");
                doctorRepository.save(d3);
            }

            if (hospitalRepository.count() == 0) {
                Hospital h1 = new Hospital();
                h1.setName("City General Hospital");
                h1.setLocation("New York");
                h1.setContactNumber("+1-555-0101");
                h1.setRating(4.8);
                h1.setFacilities("Emergency, ICU, Radiology, Pharmacy");
                hospitalRepository.save(h1);

                Hospital h2 = new Hospital();
                h2.setName("Metro Health Center");
                h2.setLocation("New York");
                h2.setContactNumber("+1-555-0202");
                h2.setRating(4.5);
                h2.setFacilities("Outpatient, Physiotherapy, Lab Services");
                hospitalRepository.save(h2);
            }
        };
    }
}
