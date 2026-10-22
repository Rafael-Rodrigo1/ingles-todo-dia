import api from "./api";
import type {
    Question,
    QuestionAdmin,
    QuestionRequest,
} from "../types/question";

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

export const getQuestionsByExerciseForAdmin = async (
    exerciseId: number
): Promise<QuestionAdmin[]> => {
    const response = await api.get<QuestionAdmin[]>(
        `/questions/admin/exercise/${exerciseId}`
    );

    return response.data;
};
