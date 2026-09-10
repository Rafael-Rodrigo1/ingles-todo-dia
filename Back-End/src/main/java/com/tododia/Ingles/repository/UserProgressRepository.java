package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository
        extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findByUserId(Long userId);

    Optional<UserProgress> findByUserIdAndLessonId(
            Long userId,
            Long lessonId
    );

    boolean existsByUserIdAndLessonId(
            Long userId,
            Long lessonId
    );
}