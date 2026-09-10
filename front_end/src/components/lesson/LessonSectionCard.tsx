import type { LessonSection, SectionType,} from "../../types/lessonSection";
import { LessonSectionContent } from "./LessonSectionContent";
import type { Exercise } from "../../types/exercise";

interface SectionTypeConfig {
    label: string;
    description: string;
}

function getSectionStyle(type: SectionType) {
    switch (type) {
        case "THEORY":
            return {
                card: "border-blue-200 bg-blue-50/50",
                badge: "bg-blue-100 text-blue-700",
            };

        case "VOCABULARY":
            return {
                card: "border-emerald-200 bg-emerald-50/50",
                badge: "bg-emerald-100 text-emerald-700",
            };

        case "EXAMPLE":
            return {
                card: "border-amber-200 bg-amber-50/50",
                badge: "bg-amber-100 text-amber-700",
            };

        case "DIALOGUE":
            return {
                card: "border-cyan-200 bg-cyan-50/50",
                badge: "bg-cyan-100 text-cyan-700",
            };

        case "GRAMMAR":
            return {
                card: "border-violet-200 bg-violet-50/50",
                badge: "bg-violet-100 text-violet-700",
            };

        case "EXERCISE":
            return {
                card: "border-orange-200 bg-orange-50/50",
                badge: "bg-orange-100 text-orange-700",
            };

        case "QUIZ":
            return {
                card: "border-rose-200 bg-rose-50/50",
                badge: "bg-rose-100 text-rose-700",
            };

        default:
            return {
                card: "border-slate-200 bg-white",
                badge: "bg-slate-100 text-slate-600",
            };
    }
}

const sectionTypeConfig: Record<SectionType, SectionTypeConfig> = {
    THEORY: {
        label: "Teoria",
        description: "Entenda o conceito",
    },

    VOCABULARY: {
        label: "Vocabulário",
        description: "Aprenda novas palavras",
    },

    EXAMPLE: {
        label: "Exemplo",
        description: "Veja o conceito na prática",
    },

    DIALOGUE: {
        label: "Diálogo",
        description: "Veja como usar em uma conversa",
    },

    GRAMMAR: {
        label: "Gramática",
        description: "Entenda a estrutura gramatical",
    },

    EXERCISE: {
        label: "Exercício",
        description: "Pratique o que aprendeu",
    },

    QUIZ: {
        label: "Quiz",
        description: "Teste seus conhecimentos",
    },
};

interface LessonSectionCardProps {
    section: LessonSection;
    index: number;
    exercises: Exercise[];
    onExerciseComplete?: (
        exerciseId: number,
        score: number,
        passed: boolean
    ) => void;
}

export function LessonSectionCard({
                                      section,
                                      index,
                                      exercises,
                                      onExerciseComplete,
                                  }: LessonSectionCardProps) {
    const config = sectionTypeConfig[section.type];
    const style = getSectionStyle(section.type);
    return (
        <article className={`rounded-xl border p-6 shadow-sm ${style.card}`}>
            <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                            {section.title}
                        </h3>

                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}>
                             {config.label}
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        {config.description}
                    </p>

                    <div className="mt-4">
                        <LessonSectionContent
                            section={section}
                            exercises={exercises}
                            onExerciseComplete={onExerciseComplete}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}