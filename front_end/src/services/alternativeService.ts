import api from "./api";
import type { Alternative } from "../types/alternative";

export const getAlternativesByQuestion = async (
    questionId: number
): Promise<Alternative[]> => {
    const response = await api.get<Alternative[]>(
        `/alternatives/question/${questionId}`
    );

    return response.data;
};