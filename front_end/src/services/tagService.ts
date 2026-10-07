import api from "./api";

import type {
    Tag,
    TagRequest,
} from "../types/tag";

export async function getTags(): Promise<Tag[]> {
    const response = await api.get<Tag[]>("/tags");

    return response.data;
}

export async function getTagById(
    id: number
): Promise<Tag> {
    const response = await api.get<Tag>(
        `/tags/${id}`
    );

    return response.data;
}

export async function getTagBySlug(
    slug: string
): Promise<Tag> {
    const response = await api.get<Tag>(
        `/tags/slug/${slug}`
    );

    return response.data;
}

export async function createTag(
    data: TagRequest
): Promise<Tag> {
    const response = await api.post<Tag>(
        "/tags",
        data
    );

    return response.data;
}

export async function updateTag(
    id: number,
    data: TagRequest
): Promise<Tag> {
    const response = await api.put<Tag>(
        `/tags/${id}`,
        data
    );

    return response.data;
}

export async function deleteTag(
    id: number
): Promise<void> {
    await api.delete(`/tags/${id}`);
}