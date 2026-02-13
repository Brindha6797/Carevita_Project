package com.example.demo.controller;

import com.example.demo.model.EmergencyContact;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmergencyContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/emergency")
public class EmergencyController {

    @Autowired
    private EmergencyContactService service;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addContact(@RequestBody EmergencyContact contact, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        EmergencyContact saved = service.addContact(user, contact);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getContacts(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<EmergencyContact> contacts = service.getUserContacts(user);
        return ResponseEntity.ok(contacts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable Long id) {
        service.deleteContact(id);
        return ResponseEntity.ok("Contact deleted");
    }
}
