package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String fullName;
    private String phone;
    private String address;
    private String birthDate;
    private String gender;

    // Daily health stats (simplified for now)
    private Integer dailyWaterIntake; // in ml
    private String dailySymptomLog; // JSON or text summary
    private String mood;

    public UserProfile() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getDailyWaterIntake() {
        return dailyWaterIntake;
    }

    public void setDailyWaterIntake(Integer dailyWaterIntake) {
        this.dailyWaterIntake = dailyWaterIntake;
    }

    public String getDailySymptomLog() {
        return dailySymptomLog;
    }

    public void setDailySymptomLog(String dailySymptomLog) {
        this.dailySymptomLog = dailySymptomLog;
    }

    public String getMood() {
        return mood;
    }

    public void setMood(String mood) {
        this.mood = mood;
    }
}
