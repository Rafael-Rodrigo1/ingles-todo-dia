export interface UserProgress {
    id: number;
    completed: boolean;
    score: number;
    percentage: number;
    lastAccess: string | null;
    currentSection: number;
    exercisesCompleted: number;
    totalStudyTime: number;
    lessonId: number;
    lessonTitle: string;
}

export interface UserProgressRequest {
    lessonId: number;
    completed: boolean;
    score: number;
    percentage: number;
    currentSection: number;
    exercisesCompleted: number;
    totalStudyTime: number;
}