package com.tododia.Ingles.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alternatives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alternative extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(nullable = false)
    private Boolean correct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

}