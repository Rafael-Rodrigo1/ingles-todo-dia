export type ExerciseDifficulty =
    | "EASY"
    | "MEDIUM"
    | "HARD";

export interface Exercise {
    id: number;
    title: string;
    description: string | null;
    passingScore: number;
    orderIndex: number;
    active: boolean;
    timeLimit: number;
    difficulty: ExerciseDifficulty;
    lessonId: number;
    lessonTitle: string;
}

export interface ExerciseRequest {
    title: string;
    description?: string;
    passingScore: number;
    orderIndex: number;
    active: boolean;
    timeLimit: number;
    difficulty: ExerciseDifficulty;
    lessonId: number;
}