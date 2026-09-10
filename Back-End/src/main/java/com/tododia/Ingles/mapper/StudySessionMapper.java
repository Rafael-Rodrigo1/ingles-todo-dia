package com.tododia.Ingles.mapper;

import com.tododia.Ingles.dto.response.StudySessionResponse;
import com.tododia.Ingles.entity.StudySession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudySessionMapper {

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    StudySessionResponse toResponse(StudySession session);

    List<StudySessionResponse> toResponseList(
            List<StudySession> sessions
    );
}