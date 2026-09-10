import api from "./api";
import type { Lesson } from "../types/lesson";

export const getLessonById = async (
    id: number
): Promise<Lesson> => {
    const response = await api.get<Lesson>(
        `/lessons/${id}`
    );

    return response.data;
};