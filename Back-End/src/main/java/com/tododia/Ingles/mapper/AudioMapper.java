package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.request.AudioRequest;
import com.tododia.Ingles.dto.response.AudioResponse;
import com.tododia.Ingles.entity.Audio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AudioMapper {

    @Mapping(target = "lessonSection", ignore = true)
    Audio toEntity(AudioRequest request);

    @Mapping(target = "lessonSectionId", source = "lessonSection.id")
    @Mapping(target = "lessonSectionTitle", source = "lessonSection.title")
    AudioResponse toResponse(Audio audio);

    List<AudioResponse> toResponseList(List<Audio> audios);
}