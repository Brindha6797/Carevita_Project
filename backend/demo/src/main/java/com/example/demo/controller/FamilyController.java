package com.example.demo.controller;

import com.example.demo.model.FamilyMember;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.DailyLogService;
import com.example.demo.service.FamilyMemberService;
import com.example.demo.service.HealthInsightsService;
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

    @Autowired
    private DailyLogService dailyLogService;

    @Autowired
    private HealthInsightsService insightsService;

    @PostMapping("/add")
    public ResponseEntity<?> addMember(@RequestBody FamilyMember member, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        FamilyMember saved = service.addMember(user, member);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@PathVariable("id") Long id, @RequestBody FamilyMember updatedMember,
            Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<FamilyMember> members = service.getUserFamilyMembers(user);
        FamilyMember existing = members.stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Family member not found"));
        existing.setName(updatedMember.getName());
        existing.setRelation(updatedMember.getRelation());
        existing.setAge(updatedMember.getAge());
        existing.setEmail(updatedMember.getEmail());
        existing.setEmergencyContact(updatedMember.getEmergencyContact());
        existing.setMedicalNotes(updatedMember.getMedicalNotes());
        FamilyMember saved = service.addMember(user, existing);
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
    public ResponseEntity<?> deleteMember(@PathVariable("id") Long id) {
        service.deleteMember(id);
        return ResponseEntity.ok("Member deleted");
    }

    @GetMapping("/{id}/health")
    public ResponseEntity<?> getMemberHealth(@PathVariable("id") Long id, Principal principal) {
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
                User target = actualUser.get();
                java.util.Map<String, Object> summary = new java.util.HashMap<>();
                summary.put("today", dailyLogService.getTodayLog(target).orElse(null));
                summary.put("insights", insightsService.generateInsights(target));
                return ResponseEntity.ok(summary);
            }
        }

        return ResponseEntity.ok(java.util.Collections.emptyMap());

    }
}
