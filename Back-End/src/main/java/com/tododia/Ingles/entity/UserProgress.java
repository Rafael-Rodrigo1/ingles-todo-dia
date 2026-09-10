package com.tododia.Ingles.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(
        name = "user_progress",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProgress extends BaseEntity {

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false;

    @Builder.Default
    @Column(nullable = false)
    private Integer score = 0;

    @Builder.Default
    @Column(nullable = false)
    private Double percentage = 0.0;

    private LocalDateTime lastAccess;

    @Builder.Default
    @Column(nullable = false)
    private Integer currentSection = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer exercisesCompleted = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer totalStudyTime = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

}