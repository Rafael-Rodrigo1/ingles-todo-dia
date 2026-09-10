package com.tododia.Ingles.repository;

import com.tododia.Ingles.entity.VocabularyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyWordRepository
        extends JpaRepository<VocabularyWord, Long> {

    List<VocabularyWord> findByCategoryId(Long categoryId);

    List<VocabularyWord> findByCategoryIdOrderByEnglishAsc(Long categoryId);
}