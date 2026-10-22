import type { LessonSection } from "../../types/lessonSection";
import type { Exercise } from "../../types/exercise";
import { ExerciseSection } from "../exercise/ExerciseSection";
import type { UserExerciseProgress } from "../../types/userExerciseProgress";

interface LessonSectionContentProps {
    section: LessonSection;
    exercises: Exercise[];
    completedExercises: Record<number, number>;
    onExerciseComplete?: (
        exerciseId: number,
        answers: { questionId: number; alternativeId: number }[]
    ) => Promise<UserExerciseProgress>;
}

export function LessonSectionContent({
                                         section,
                                         exercises,
                                         completedExercises,
                                         onExerciseComplete,
                                     }: LessonSectionContentProps) {
    switch (section.type) {
        case "THEORY":
        case "VOCABULARY":
        case "EXAMPLE":
        case "DIALOGUE":
        case "GRAMMAR":
            return (
                <p className="whitespace-pre-line leading-7 text-slate-700">
                    {section.content}
                </p>
            );

        case "EXERCISE":
            return (
                <ExerciseSection
                    exercises={exercises}
                    completedExercises={completedExercises}
                    onExerciseComplete={onExerciseComplete}
                />
            );
        case "QUIZ":
            return (
                <p className="text-sm text-slate-600">
                    O quiz desta seção será carregado aqui.
                </p>
            );

        default:
            return null;
    }
}