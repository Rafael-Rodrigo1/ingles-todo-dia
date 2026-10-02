import api from "./api";

import type {
    Lesson,
    LessonRequest,
} from "../types/lesson";

export async function getLessons(): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>("/lessons");

    return response.data;
}

export async function getLessonById(
    id: number
): Promise<Lesson> {
    const response = await api.get<Lesson>(
        `/lessons/${id}`
    );

    return response.data;
}

export async function getLessonsByCategory(
    categoryId: number
): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>(
        `/lessons/category/${categoryId}`
    );

    return response.data;
}

export async function createLesson(
    data: LessonRequest
): Promise<Lesson> {
    const response = await api.post<Lesson>(
        "/lessons",
        data
    );

    return response.data;
}

export async function updateLesson(
    id: number,
    data: LessonRequest
): Promise<Lesson> {
    const response = await api.put<Lesson>(
        `/lessons/${id}`,
        data
    );

    return response.data;
}

export async function deleteLesson(
    id: number
): Promise<void> {
    await api.delete(`/lessons/${id}`);
}