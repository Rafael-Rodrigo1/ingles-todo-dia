package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    Optional<Lesson> findBySlug(String slug);

    boolean existsBySlug(String slug);

    List<Lesson> findByPublishedTrue();

    List<Lesson> findByCategoryId(Long categoryId);

}