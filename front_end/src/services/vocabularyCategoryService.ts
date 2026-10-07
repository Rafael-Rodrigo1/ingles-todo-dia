import api from "./api";

import type {
    VocabularyCategory,
    VocabularyCategoryRequest,
} from "../types/vocabulary";

export async function getVocabularyCategories():
    Promise<VocabularyCategory[]> {

    const response =
        await api.get<VocabularyCategory[]>(
            "/vocabulary-categories"
        );

    return response.data;
}

export async function getVocabularyCategoryById(
    id: number
): Promise<VocabularyCategory> {

    const response =
        await api.get<VocabularyCategory>(
            `/vocabulary-categories/${id}`
        );

    return response.data;
}

export async function getActiveVocabularyCategories():
    Promise<VocabularyCategory[]> {

    const response =
        await api.get<VocabularyCategory[]>(
            "/vocabulary-categories/active"
        );

    return response.data;
}

export async function createVocabularyCategory(
    data: VocabularyCategoryRequest
): Promise<VocabularyCategory> {

    const response =
        await api.post<VocabularyCategory>(
            "/vocabulary-categories",
            data
        );

    return response.data;
}

export async function updateVocabularyCategory(
    id: number,
    data: VocabularyCategoryRequest
): Promise<VocabularyCategory> {

    const response =
        await api.put<VocabularyCategory>(
            `/vocabulary-categories/${id}`,
            data
        );

    return response.data;
}

export async function deleteVocabularyCategory(
    id: number
): Promise<void> {

    await api.delete(
        `/vocabulary-categories/${id}`
    );
}