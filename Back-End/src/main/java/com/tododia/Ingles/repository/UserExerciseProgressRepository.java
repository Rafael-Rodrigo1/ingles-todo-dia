package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.UserExerciseProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserExerciseProgressRepository
        extends JpaRepository<UserExerciseProgress, Long> {

    Optional<UserExerciseProgress> findByUserIdAndExerciseId(
            Long userId,
            Long exerciseId
    );

    List<UserExerciseProgress> findByUserIdAndExerciseLessonId(
            Long userId,
            Long lessonId
    );
}