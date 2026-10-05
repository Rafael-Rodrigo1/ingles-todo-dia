import api from "./api";

import type {
    Exercise,
    ExerciseRequest,
} from "../types/exercise";

export async function getExercises(): Promise<Exercise[]> {
    const response = await api.get<Exercise[]>("/exercises");

    return response.data;
}

export async function getExerciseById(
    id: number
): Promise<Exercise> {
    const response = await api.get<Exercise>(
        `/exercises/${id}`
    );

    return response.data;
}

export async function getExercisesByLesson(
    lessonId: number
): Promise<Exercise[]> {
    const response = await api.get<Exercise[]>(
        `/exercises/lesson/${lessonId}`
    );

    return response.data;
}

export async function createExercise(
    data: ExerciseRequest
): Promise<Exercise> {
    const response = await api.post<Exercise>(
        "/exercises",
        data
    );

    return response.data;
}

export async function updateExercise(
    id: number,
    data: ExerciseRequest
): Promise<Exercise> {
    const response = await api.put<Exercise>(
        `/exercises/${id}`,
        data
    );

    return response.data;
}

export async function deleteExercise(
    id: number
): Promise<void> {
    await api.delete(`/exercises/${id}`);
}