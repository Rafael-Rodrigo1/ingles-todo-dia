package com.tododia.Ingles.entity;


import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String statement;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Builder.Default
    @Column(nullable = false)
    private Integer orderIndex = 0;

    @Column(length = 255)
    private String imageUrl;

    @Column(length = 255)
    private String audioUrl;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @Builder.Default
    @Column(nullable = false)
    private Integer points = 1;

    @Builder.Default
    @OneToMany(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )


    private List<Alternative> alternatives = new ArrayList<>();

}