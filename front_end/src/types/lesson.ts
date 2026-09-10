export interface Lesson {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    difficulty: string;
    level: string;
    estimatedTime: number;
    thumbnail: string | null;
    published: boolean;
    orderIndex: number;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
}