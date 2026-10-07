export interface VocabularyCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    active: boolean;
    orderIndex: number;
}

export interface VocabularyCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    active: boolean;
    orderIndex: number;
}

export type VocabularyEnglishLevel =
    | "A1"
    | "A2"
    | "B1"
    | "B2"
    | "C1"
    | "C2";

export interface VocabularyWord {
    id: number;
    english: string;
    portuguese: string;
    pronunciation: string | null;
    audioUrl: string | null;
    imageUrl: string | null;
    exampleEnglish: string | null;
    examplePortuguese: string | null;
    observation: string | null;
    level: VocabularyEnglishLevel | null;
    categoryId: number;
    categoryName: string;
}

export interface VocabularyWordRequest {
    english: string;
    portuguese: string;
    pronunciation?: string;
    audioUrl?: string;
    imageUrl?: string;
    exampleEnglish?: string;
    examplePortuguese?: string;
    observation?: string;
    level?: VocabularyEnglishLevel;
    categoryId: number;
}