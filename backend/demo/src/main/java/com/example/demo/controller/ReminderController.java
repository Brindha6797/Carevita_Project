package com.example.demo.controller;

import com.example.demo.model.DailyLog;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.DailyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    @Autowired
    private DailyLogService dailyLogService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/buddy")
    public ResponseEntity<?> getReminder(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<DailyLog> lastLog = dailyLogService.getTodayLog(user);

        Map<String, Object> response = new HashMap<>();
        if (lastLog.isPresent()) {
            response.put("message", "Great job! You already logged your health today.");
            response.put("needsLog", false);
        } else {
            response.put("message",
                    "Care Reminder Buddy: You haven't logged your health today. Consistent tracking helps us predict patterns better!");
            response.put("needsLog", true);
        }

        return ResponseEntity.ok(response);
    }
}
