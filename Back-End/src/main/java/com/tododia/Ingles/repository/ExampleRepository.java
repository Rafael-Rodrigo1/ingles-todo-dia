package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExampleRepository extends JpaRepository<Example, Long> {

    List<Example> findByLessonSectionId(Long lessonSectionId);
}