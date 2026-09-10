package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository
        extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserId(Long userId);

    Optional<Favorite> findByUserIdAndLessonId(
            Long userId,
            Long lessonId
    );

    boolean existsByUserIdAndLessonId(
            Long userId,
            Long lessonId
    );

    void deleteByUserIdAndLessonId(
            Long userId,
            Long lessonId
    );
}
