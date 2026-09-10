package com.tododia.Ingles.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long id;

    private String name;

    private String slug;

    private String description;

    private String icon;

    private String color;

    private Integer orderIndex;

    private Boolean active;

}