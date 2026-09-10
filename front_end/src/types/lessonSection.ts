export type SectionType =
    | "THEORY"
    | "VOCABULARY"
    | "EXAMPLE"
    | "DIALOGUE"
    | "GRAMMAR"
    | "EXERCISE"
    | "QUIZ";

export interface LessonSection {
    id: number;
    title: string;
    content: string;
    type: SectionType;
    orderIndex: number;
    lessonId: number;
    lessonTitle: string;
}