
export interface UserExerciseProgress {
    id: number;
    exerciseId: number;
    completed: boolean;
    score: number;
    attempts: number;
    lastAttempt: string;
    attemptScore?: number;
    attemptPassed?: boolean;
}

export interface ExerciseAnswer {
    questionId: number;
    alternativeId: number;
}

export interface SaveUserExerciseProgress {
    exerciseId: number;
    answers: ExerciseAnswer[];
}
