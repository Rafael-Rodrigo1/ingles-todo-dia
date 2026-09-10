package com.tododia.Ingles.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySession extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Builder.Default
    @Column(nullable = false)
    private Integer duration = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer score = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer correctAnswers = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer wrongAnswers = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false;
}
