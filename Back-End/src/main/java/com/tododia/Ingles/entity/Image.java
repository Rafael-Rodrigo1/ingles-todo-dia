package com.tododia.Ingles.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image extends BaseEntity {

    @Column(nullable = false)
    private String url;

    private String description;

    private String altText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_section_id")
    private LessonSection lessonSection;
}
