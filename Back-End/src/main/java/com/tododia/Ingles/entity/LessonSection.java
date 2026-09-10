package com.tododia.Ingles.entity;


import com.tododia.Ingles.enums.SectionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lesson_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonSection extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SectionType type;

    @Column(nullable = false)
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Builder.Default
    @OneToMany(
            mappedBy = "lessonSection",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Audio> audios = new ArrayList<>();

    @Builder.Default
    @OneToMany(
            mappedBy = "lessonSection",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Example> examples = new ArrayList<>();

    @Builder.Default
    @OneToMany(
            mappedBy = "lessonSection",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Image> images = new ArrayList<>();
}
