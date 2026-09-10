package com.tododia.Ingles.service;

import com.tododia.Ingles.dto.request.FinishStudySessionRequest;
import com.tododia.Ingles.dto.request.StudySessionRequest;
import com.tododia.Ingles.dto.response.StudySessionResponse;
import com.tododia.Ingles.entity.Lesson;
import com.tododia.Ingles.entity.StudySession;
import com.tododia.Ingles.entity.User;
import com.tododia.Ingles.exception.ResourceNotFoundException;
import com.tododia.Ingles.mapper.StudySessionMapper;
import com.tododia.Ingles.repository.LessonRepository;
import com.tododia.Ingles.repository.StudySessionRepository;
import com.tododia.Ingles.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StudySessionService {

    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final StudySessionMapper mapper;

    public StudySessionResponse start(StudySessionRequest request) {

        User user = getAuthenticatedUser();

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lição não encontrada."
                        ));

        StudySession session = StudySession.builder()
                .user(user)
                .lesson(lesson)
                .startTime(LocalDateTime.now())
                .duration(0)
                .score(0)
                .correctAnswers(0)
                .wrongAnswers(0)
                .completed(false)
                .build();

        StudySession saved = sessionRepository.save(session);

        return mapper.toResponse(saved);
    }

    public StudySessionResponse finish(
            Long id,
            FinishStudySessionRequest request) {

        User user = getAuthenticatedUser();

        StudySession session = sessionRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Sessão de estudo não encontrada."
                        ));

        LocalDateTime endTime = LocalDateTime.now();

        long durationSeconds = Duration.between(
                session.getStartTime(),
                endTime
        ).getSeconds();

        session.setEndTime(endTime);
        session.setDuration(
                Math.toIntExact(Math.max(0, durationSeconds))
        );

        session.setScore(request.getScore());
        session.setCorrectAnswers(request.getCorrectAnswers());
        session.setWrongAnswers(request.getWrongAnswers());
        session.setCompleted(request.getCompleted());

        StudySession saved = sessionRepository.save(session);

        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<StudySessionResponse> findMySessions() {

        User user = getAuthenticatedUser();

        return mapper.toResponseList(
                sessionRepository
                        .findByUserIdOrderByStartTimeDesc(user.getId())
        );
    }

    @Transactional(readOnly = true)
    public StudySessionResponse findMySessionById(Long id) {

        User user = getAuthenticatedUser();

        StudySession session = sessionRepository
                .findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Sessão de estudo não encontrada."
                        ));

        return mapper.toResponse(session);
    }

    @Transactional(readOnly = true)
    public List<StudySessionResponse> findMySessionsByLesson(
            Long lessonId) {

        User user = getAuthenticatedUser();

        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException(
                    "Lição não encontrada."
            );
        }

        return mapper.toResponseList(
                sessionRepository
                        .findByUserIdAndLessonIdOrderByStartTimeDesc(
                                user.getId(),
                                lessonId
                        )
        );
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new IllegalStateException(
                    "Usuário não autenticado."
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuário autenticado não encontrado."
                        ));
    }
}