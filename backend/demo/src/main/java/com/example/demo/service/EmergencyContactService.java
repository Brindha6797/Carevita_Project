package com.example.demo.service;

import com.example.demo.model.EmergencyContact;
import com.example.demo.model.User;
import com.example.demo.repository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmergencyContactService {
    @Autowired
    private EmergencyContactRepository repository;

    public EmergencyContact addContact(User user, EmergencyContact contact) {
        contact.setUser(user);
        return repository.save(contact);
    }

    public List<EmergencyContact> getUserContacts(User user) {
        return repository.findByUser(user);
    }

    public void deleteContact(Long id) {
        repository.deleteById(id);
    }
}
