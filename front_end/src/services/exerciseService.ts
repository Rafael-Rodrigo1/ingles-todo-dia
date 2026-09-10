import api from "./api";
import type { Exercise } from "../types/exercise";

export const getExercisesByLesson = async (
    lessonId: number
): Promise<Exercise[]> => {
    const response = await api.get<Exercise[]>(
        `/exercises/lesson/${lessonId}`
    );

    return response.data;
};