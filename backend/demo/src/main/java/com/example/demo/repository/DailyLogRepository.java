package com.example.demo.repository;

import com.example.demo.model.DailyLog;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    List<DailyLog> findByUserOrderByLogDateDesc(User user);

    Optional<DailyLog> findByUserAndLogDate(User user, LocalDate logDate);
}
