package com.example.demo.service;

import com.example.demo.model.DailyLog;
import com.example.demo.model.User;
import com.example.demo.repository.DailyLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DailyLogService {
    @Autowired
    private DailyLogRepository repository;

    public DailyLog saveOrUpdateLog(User user, DailyLog logData) {
        LocalDate today = LocalDate.now();
        Optional<DailyLog> existingLog = repository.findByUserAndLogDate(user, today);

        DailyLog logToSave;
        if (existingLog.isPresent()) {
            logToSave = existingLog.get();
            if (logData.getWaterIntake() != null)
                logToSave.setWaterIntake(logData.getWaterIntake());
            if (logData.getMood() != null)
                logToSave.setMood(logData.getMood());
            if (logData.getSymptoms() != null)
                logToSave.setSymptoms(logData.getSymptoms());
            if (logData.getSleepHours() != null)
                logToSave.setSleepHours(logData.getSleepHours());
        } else {
            logToSave = logData;
            logToSave.setUser(user);
            logToSave.setLogDate(today);
        }
        return repository.save(logToSave);
    }

    public List<DailyLog> getUserLogs(User user) {
        return repository.findByUserOrderByLogDateDesc(user);
    }

    public Optional<DailyLog> getTodayLog(User user) {
        return repository.findByUserAndLogDate(user, LocalDate.now());
    }
}
