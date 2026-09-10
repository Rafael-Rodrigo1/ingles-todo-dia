package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.Audio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AudioRepository extends JpaRepository<Audio, Long> {

    List<Audio> findByLessonSectionId(Long lessonSectionId);
}