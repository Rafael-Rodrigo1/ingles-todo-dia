package com.tododia.Ingles.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Audio extends BaseEntity {

    @Column(nullable = false)
    private String url;

    private Integer duration;

    private String transcript;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_section_id")
    private LessonSection lessonSection;
}
