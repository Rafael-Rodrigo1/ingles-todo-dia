
import api from "./api";

import type { LessonSection, LessonSectionRequest} from "../types/lessonSection";

export async function getLessonSectionsByLesson(
    lessonId: number
): Promise<LessonSection[]> {
    const response = await api.get<LessonSection[]>(
        `/lesson-sections/lesson/${lessonId}`
    );

    return response.data;
}

export async function createLessonSection(
    data: LessonSectionRequest
): Promise<LessonSection> {
    const response = await api.post<LessonSection>(
        "/lesson-sections",
        data
    );

    return response.data;
}

export async function updateLessonSection(
    id: number,
    data: LessonSectionRequest
): Promise<LessonSection> {
    const response = await api.put<LessonSection>(
        `/lesson-sections/${id}`,
        data
    );

    return response.data;
}

export async function deleteLessonSection(
    id: number
): Promise<void> {
    await api.delete(`/lesson-sections/${id}`);
}
