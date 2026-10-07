import api from "./api";

import type {
    VocabularyWord,
    VocabularyWordRequest,
} from "../types/vocabulary";

export async function getVocabularyWords():
    Promise<VocabularyWord[]> {

    const response =
        await api.get<VocabularyWord[]>(
            "/vocabulary-words"
        );

    return response.data;
}

export async function getVocabularyWordById(
    id: number
): Promise<VocabularyWord> {

    const response =
        await api.get<VocabularyWord>(
            `/vocabulary-words/${id}`
        );

    return response.data;
}

export async function getVocabularyWordsByCategory(
    categoryId: number
): Promise<VocabularyWord[]> {

    const response =
        await api.get<VocabularyWord[]>(
            `/vocabulary-words/category/${categoryId}`
        );

    return response.data;
}

export async function createVocabularyWord(
    data: VocabularyWordRequest
): Promise<VocabularyWord> {

    const response =
        await api.post<VocabularyWord>(
            "/vocabulary-words",
            data
        );

    return response.data;
}

export async function updateVocabularyWord(
    id: number,
    data: VocabularyWordRequest
): Promise<VocabularyWord> {

    const response =
        await api.put<VocabularyWord>(
            `/vocabulary-words/${id}`,
            data
        );

    return response.data;
}

export async function deleteVocabularyWord(
    id: number
): Promise<void> {

    await api.delete(
        `/vocabulary-words/${id}`
    );
}