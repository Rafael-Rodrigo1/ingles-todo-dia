import api from "./api";
import type { Question } from "../types/question";

export const getQuestionsByExercise = async (
    exerciseId: number
): Promise<Question[]> => {
    const response = await api.get<Question[]>(
        `/questions/exercise/${exerciseId}`
    );

    return response.data;
};