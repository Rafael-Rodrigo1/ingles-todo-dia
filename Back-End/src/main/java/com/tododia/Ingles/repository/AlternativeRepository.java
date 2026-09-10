package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.Alternative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlternativeRepository
        extends JpaRepository<Alternative, Long> {

    List<Alternative> findByQuestionId(Long questionId);
}