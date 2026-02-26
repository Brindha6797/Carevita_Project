package com.example.demo.controller;

import com.example.demo.model.DailyLog;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.DailyLogService;
import com.example.demo.service.HealthInsightsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private DailyLogService dailyLogService;

    @Autowired
    private HealthInsightsService insightsService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/log")
    public ResponseEntity<?> logDailyHealth(@RequestBody DailyLog logData, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        DailyLog savedLog = dailyLogService.saveOrUpdateLog(user, logData);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getHealthSummary(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> summary = new HashMap<>();
        summary.put("today", dailyLogService.getTodayLog(user).orElse(null));
        summary.put("history", dailyLogService.getUserLogs(user));
        summary.put("insights", insightsService.generateInsights(user));

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientHealthSummary(@PathVariable("patientId") Long patientId) {
        User user = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Map<String, Object> summary = new HashMap<>();
        summary.put("today", dailyLogService.getTodayLog(user).orElse(null));
        summary.put("history", dailyLogService.getUserLogs(user));
        summary.put("insights", insightsService.generateInsights(user));

        return ResponseEntity.ok(summary);
    }
}
