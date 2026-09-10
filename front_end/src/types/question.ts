export interface Question {
    id: number;
    statement: string;
    explanation: string | null;
    orderIndex: number;
    imageUrl: string | null;
    audioUrl: string | null;
    points: number;
    exerciseId: number;
    exerciseTitle: string;
}