package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudySessionRepository
        extends JpaRepository<StudySession, Long> {

    List<StudySession> findByUserIdOrderByStartTimeDesc(Long userId);

    List<StudySession> findByUserIdAndLessonIdOrderByStartTimeDesc(
            Long userId,
            Long lessonId
    );

    Optional<StudySession> findByIdAndUserId(
            Long id,
            Long userId
    );
}
