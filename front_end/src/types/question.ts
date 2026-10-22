
export interface Question {
    id: number;
    statement: string;
    orderIndex: number;
    imageUrl: string | null;
    audioUrl: string | null;
    points: number;
    exerciseId: number;
    exerciseTitle: string;
}

export interface QuestionRequest {
    statement: string;
    explanation: string | null;
    orderIndex: number;
    imageUrl: string | null;
    audioUrl: string | null;
    points: number;
    exerciseId: number;
}

export interface QuestionAdmin extends Question {
    explanation: string | null;
}