export type Difficulty =
    | "EASY"
    | "MEDIUM"
    | "HARD";

export type EnglishLevel =
    | "A1"
    | "A2"
    | "B1"
    | "B2"
    | "C1"
    | "C2";

export interface Lesson {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    difficulty: Difficulty;
    level: EnglishLevel;
    estimatedTime: number;
    thumbnail: string | null;
    published: boolean | null;
    orderIndex: number | null;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
}

export interface LessonRequest {
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    difficulty: Difficulty;
    level: EnglishLevel;
    estimatedTime: number;
    thumbnail?: string;
    published: boolean;
    orderIndex: number;
    categoryId: number;
}