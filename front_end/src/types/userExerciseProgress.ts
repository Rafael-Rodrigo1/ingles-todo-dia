export interface UserExerciseProgress {
    id: number;
    exerciseId: number;
    completed: boolean;
    score: number;
    attempts: number;
    lastAttempt: string;
}

export interface SaveUserExerciseProgress {
    exerciseId: number;
    completed: boolean;
    score: number;
}