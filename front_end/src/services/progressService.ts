import api from "./api";
import type {
    UserProgress,
    UserProgressRequest,
} from "../types/userProgress";

export const getMyProgress = async (): Promise<UserProgress[]> => {
    const response = await api.get<UserProgress[]>("/progress");

    return response.data;
};

export const getMyProgressByLesson = async (
    lessonId: number
): Promise<UserProgress> => {
    const response = await api.get<UserProgress>(
        `/progress/lesson/${lessonId}`
    );

    return response.data;
};

export const saveProgress = async (
    progress: UserProgressRequest
): Promise<UserProgress> => {
    const response = await api.put<UserProgress>(
        "/progress",
        progress
    );

    return response.data;
};