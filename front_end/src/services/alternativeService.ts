
import api from "./api";
import type {
    Alternative,
    AlternativeRequest,
} from "../types/alternative";

export const getAlternativesByQuestion = async (
    questionId: number
): Promise<Alternative[]> => {
    const response = await api.get<Alternative[]>(
        `/alternatives/question/${questionId}`
    );

    return response.data;
};

export const createAlternative = async (
    data: AlternativeRequest
): Promise<Alternative> => {
    const response = await api.post<Alternative>(
        "/alternatives",
        data
    );

    return response.data;
};

export const updateAlternative = async (
    id: number,
    data: AlternativeRequest
): Promise<Alternative> => {
    const response = await api.put<Alternative>(
        `/alternatives/${id}`,
        data
    );

    return response.data;
};

export const deleteAlternative = async (
    id: number
): Promise<void> => {
    await api.delete(`/alternatives/${id}`);
};
