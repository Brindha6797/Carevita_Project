package com.example.demo.controller;

import com.example.demo.model.FamilyMember;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FamilyMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/family")
public class FamilyController {

    @Autowired
    private FamilyMemberService service;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addMember(@RequestBody FamilyMember member, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        FamilyMember saved = service.addMember(user, member);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getMembers(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<FamilyMember> members = service.getUserFamilyMembers(user);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        service.deleteMember(id);
        return ResponseEntity.ok("Member deleted");
    }

    @GetMapping("/{id}/health")
    public ResponseEntity<?> getMemberHealth(@PathVariable Long id, Principal principal) {
        // Simple implementation: find family member, then find actual user by email to
        // get logs
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<FamilyMember> members = service.getUserFamilyMembers(user);
        FamilyMember member = members.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Family member not found for this user"));

        if (member.getEmail() != null) {
            java.util.Optional<User> actualUser = userRepository.findByEmail(member.getEmail());
            if (actualUser.isPresent()) {
                // If they are a registered user, we could potentially return their logs
                // For security/simplicity in this academic project, we'll return a placeholder
                // or real logs if authorized
                return ResponseEntity.ok(actualUser.get());
            }
        }

        return ResponseEntity.ok("No health data available for this member yet.");
    }
}
