import type { LessonSection } from "../../types/lessonSection";
import type { Exercise } from "../../types/exercise";
import { ExerciseSection } from "../exercise/ExerciseSection";

interface LessonSectionContentProps {
    section: LessonSection;
    exercises: Exercise[];
    onExerciseComplete?: (
        exerciseId: number,
        score: number,
        passed: boolean
    ) => void;
}

export function LessonSectionContent({
                                         section,
                                         exercises,
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