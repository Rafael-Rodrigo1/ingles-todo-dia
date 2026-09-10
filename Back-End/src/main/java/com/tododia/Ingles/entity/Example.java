package com.tododia.Ingles.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "examples")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Example extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String english;

    @Column(columnDefinition = "TEXT")
    private String portuguese;

    private String explanation;

    private String audioUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_section_id")
    private LessonSection lessonSection;
}