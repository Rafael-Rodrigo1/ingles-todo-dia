package com.tododia.Ingles.entity;

import com.tododia.Ingles.enums.EnglishLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_vocabulary_word")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VocabularyWord extends BaseEntity {

    @Column(nullable = false)
    private String english;

    @Column(nullable = false)
    private String portuguese;

    private String pronunciation;

    private String audioUrl;

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String exampleEnglish;

    @Column(columnDefinition = "TEXT")
    private String examplePortuguese;

    @Column(columnDefinition = "TEXT")
    private String observation;

    @Enumerated(EnumType.STRING)
    private EnglishLevel level;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private VocabularyCategory category;

}