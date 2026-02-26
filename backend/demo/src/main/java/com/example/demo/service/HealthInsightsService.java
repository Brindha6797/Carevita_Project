package com.example.demo.service;

import com.example.demo.model.DailyLog;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class HealthInsightsService {
    @Autowired
    private DailyLogService dailyLogService;

    public List<String> generateInsights(User user) {
        List<DailyLog> logs = dailyLogService.getUserLogs(user);
        List<String> insights = new ArrayList<>();

        if (logs.isEmpty()) {
            insights.add("Start logging your daily health to get personalized insights!");
            return insights;
        }

        // 1. Hydration & Headache Pattern (Dehydration Risk)
        Double avgWater = logs.stream().limit(7).mapToLong(DailyLog::getWaterIntake).average().orElse(0.0);
        long headacheCount = logs.stream().limit(7)
                .filter(l -> l.getSymptoms() != null && l.getSymptoms().toLowerCase().contains("headache"))
                .count();

        if (avgWater < 1500 && headacheCount >= 2) {
            insights.add("ALERT: High Dehydration Risk detected. Low water intake linked with frequent headaches.");
        } else if (avgWater < 2000) {
            insights.add("Tip: Your average hydration is " + Math.round(avgWater)
                    + "ml. Aim for 2500ml for optimal health.");
        }

        // 2. Sleep & Tiredness Pattern (Rest Risk)
        Double avgSleep = logs.stream().limit(7).mapToDouble(DailyLog::getSleepHours).average().orElse(0.0);
        long tirednessCount = logs.stream().limit(7)
                .filter(l -> l.getSymptoms() != null && l.getSymptoms().toLowerCase().contains("tired"))
                .count();

        if (avgSleep < 6 && tirednessCount >= 3) {
            insights.add("ALERT: Sleep Deprivation Pattern. Frequent tiredness noted with less than 6 hours of sleep.");
        } else if (avgSleep < 7) {
            insights.add("Insight: You've been averaging " + String.format("%.1f", avgSleep)
                    + " hours of sleep. Try to hit 8 hours to reduce fatigue.");
        }

        // 3. Mood + Health Sync (Stress & Mood Pattern)
        long stressedMoodCount = logs.stream().limit(7)
                .filter(l -> l.getMood() != null
                        && (l.getMood().equalsIgnoreCase("stressed") || l.getMood().equalsIgnoreCase("anxious")))
                .count();

        if (stressedMoodCount >= 3) {
            insights.add("PATTERN: Stress Risk. We've noticed a trend of high stress levels in your recent logs.");
            if (headacheCount >= 2) {
                insights.add("Correlation: Your headaches may be linked to the recorded stress levels.");
            }
        }

        // 4. Flu-like Symptom Correlation
        long feverCount = logs.stream().limit(5)
                .filter(l -> l.getSymptoms() != null && l.getSymptoms().toLowerCase().contains("fever"))
                .count();
        long bodyPainCount = logs.stream().limit(5)
                .filter(l -> l.getSymptoms() != null && l.getSymptoms().toLowerCase().contains("body pain"))
                .count();

        if (feverCount >= 2 && bodyPainCount >= 2) {
            insights.add("ALERT: Flu-like Pattern detected. Please monitor your temperature and stay hydrated.");
        }

        // 5. Fatigue & Activity Correlation
        long coughCount = logs.stream().limit(7)
                .filter(l -> l.getSymptoms() != null && l.getSymptoms().toLowerCase().contains("cough"))
                .count();
        if (coughCount >= 3) {
            insights.add(
                    "Insight: Persistent cough detected. If this continues for more than a week, consider consulting a specialist.");
        }

        // 6. Family Reminder Buddy Logic
        if (logs.size() > 1 && logs.get(0).getLogDate().isBefore(java.time.LocalDate.now())) {
            insights.add("Reminder: You haven't logged today's health! Consistent tracking helps Predictor accuracy.");
        }

        // 7. Doctor-Free First Insight (Guidelines/Lifestyle Suggestions)
        if (headacheCount >= 1) {
            insights.add(
                    "Lifestyle Tip: For headaches, ensure you're in a well-ventilated room and try a cold compress.");
        }
        if (tirednessCount >= 1) {
            insights.add(
                    "Lifestyle Tip: To combat tiredness, try short 20-minute power naps and reduce screen time before bed.");
        }
        if (feverCount >= 1) {
            insights.add("Care Tip: For fever, drink plenty of fluids and use lightweight clothing.");
        }
        if (avgWater < 2000) {
            insights.add(
                    "Lifestyle Tip: Carrying a reusable water bottle can help you reach your daily hydration goals.");
        }

        return insights;
    }
}
