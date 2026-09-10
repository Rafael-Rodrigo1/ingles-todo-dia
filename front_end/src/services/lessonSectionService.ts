import api from "./api";
import type { LessonSection } from "../types/lessonSection";

export const getLessonSectionsByLesson = async (
    lessonId: number
): Promise<LessonSection[]> => {
    const response = await api.get<LessonSection[]>(
        `/lesson-sections/lesson/${lessonId}`
    );

    return response.data;
};