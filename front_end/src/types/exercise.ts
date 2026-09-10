export interface Exercise {
    id: number;
    title: string;
    description: string;
    passingScore: number;
    orderIndex: number;
    active: boolean;
    timeLimit: number;
    difficulty: string;
    lessonId: number;
    lessonTitle: string;
}s