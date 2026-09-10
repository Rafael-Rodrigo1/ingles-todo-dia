package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.VocabularyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VocabularyCategoryRepository
        extends JpaRepository<VocabularyCategory, Long> {

    Optional<VocabularyCategory> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByName(String name);

    List<VocabularyCategory> findByActiveTrueOrderByOrderIndexAsc();
}