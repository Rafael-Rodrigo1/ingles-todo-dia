export interface Alternative {
    id: number;
    text: string;
    questionId: number;
    questionStatement: string;
}

export interface AlternativeRequest {
    text: string;
    correct: boolean;
    questionId: number;
}

export interface AlternativeAdmin extends Alternative {
    correct: boolean;
}

