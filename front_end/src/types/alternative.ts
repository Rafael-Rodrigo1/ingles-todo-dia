export interface Alternative {
    id: number;
    text: string;
    correct: boolean;
    questionId: number;
    questionStatement: string;
}

export interface AlternativeRequest {
    text: string;
    correct: boolean;
    questionId: number;
}