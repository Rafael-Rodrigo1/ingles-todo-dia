package com.tododia.Ingles.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_exercise_progress",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "exercise_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserExerciseProgress extends BaseEntity {

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false;

    @Builder.Default
    @Column(nullable = false)
    private Integer score = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer attempts = 0;

    private LocalDateTime lastAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
}