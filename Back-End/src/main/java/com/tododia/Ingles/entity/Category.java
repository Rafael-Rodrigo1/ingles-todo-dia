package com.tododia.Ingles.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String icon;

    @Column(length = 20)
    private String color;

    @Column(nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    @OneToMany(
            mappedBy = "category",
            cascade = CascadeType.ALL
    )
    private List<Lesson> lessons = new ArrayList<>();
}

