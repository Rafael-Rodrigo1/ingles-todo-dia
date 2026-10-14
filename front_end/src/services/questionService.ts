import api from "./api";
import type { Question, QuestionRequest } from "../types/question";

export const getQuestionsByExercise = async (
    exerciseId: number
): Promise<Question[]> => {
    const response = await api.get<Question[]>(
        `/questions/exercise/${exerciseId}`
    );

    return response.data;
};

export const createQuestion = async (
    data: QuestionRequest
): Promise<Question> => {
    const response = await api.post<Question>(
        "/questions",
        data
    );

    return response.data;
};

export const updateQuestion = async (
    id: number,
    data: QuestionRequest
): Promise<Question> => {
    const response = await api.put<Question>(
        `/questions/${id}`,
        data
    );

    return response.data;
};

export const deleteQuestion = async (
    id: number
): Promise<void> => {
    await api.delete(`/questions/${id}`);
};