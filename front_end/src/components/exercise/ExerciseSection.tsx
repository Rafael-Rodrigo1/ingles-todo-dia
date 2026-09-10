import type { Exercise } from "../../types/exercise";
import { useEffect, useRef, useState } from "react";
import { getQuestionsByExercise } from "../../services/questionService";
import type { Question } from "../../types/question";
import { QuestionCard } from "./QuestionCard";

interface ExerciseSectionProps {
    exercises: Exercise[];
    onExerciseComplete?: (
        exerciseId: number,
        score: number,
        passed: boolean
    ) => void;
}

interface ExerciseCardProps {
    exercise: Exercise;
    index: number;
    onExerciseComplete?: (
        exerciseId: number,
        score: number,
        passed: boolean
    ) => void;
}

function ExerciseCard({exercise, index, onExerciseComplete, } : ExerciseCardProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState<Record<number, boolean>>({});

    const completionSent = useRef(false);

    useEffect(() => {
        async function loadQuestions() {
            try {
                const data = await getQuestionsByExercise(exercise.id);

                setQuestions(
                    [...data].sort(
                        (a, b) => a.orderIndex - b.orderIndex
                    )
                );
            } catch (error) {
                console.error(
                    `Erro ao carregar perguntas do exercício ${exercise.id}:`,
                    error
                );

                setError("Não foi possível carregar as perguntas.");
            } finally {
                setLoading(false);
            }
        }

        loadQuestions();
    }, [exercise.id]);

    function handleAnswer(
        questionId: number,
        correct: boolean
    ) {
        console.log(
            "Resultado recebido:",
            questionId,
            correct
        );

        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [questionId]: correct,
        }));
    }

    const answeredQuestions = Object.keys(answers).length;

    const correctAnswers = Object.values(answers).filter(
        (correct) => correct
    ).length;

    const totalQuestions = questions.length;

    const score =
        totalQuestions > 0
            ? Math.round(
                (correctAnswers / totalQuestions) * 100
            )
            : 0;

    const exerciseCompleted =
        totalQuestions > 0 &&
        answeredQuestions === totalQuestions;

    const passed =
        exerciseCompleted &&
        score >= exercise.passingScore;

    useEffect(() => {
        if (
            !exerciseCompleted ||
            completionSent.current
        ) {
            return;
        }

        completionSent.current = true;

        onExerciseComplete?.(
            exercise.id,
            score,
            passed
        );
    }, [
        exerciseCompleted,
        exercise.id,
        score,
        passed,
        onExerciseComplete,
    ]);

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Exercício {index + 1}
                    </p>

                    <h4 className="mt-1 text-lg font-semibold text-slate-900">
                        {exercise.title}
                    </h4>

                    {exercise.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {exercise.description}
                        </p>
                    )}
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {exercise.difficulty}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>
                    Nota mínima: {exercise.passingScore}%
                </span>

                {exercise.timeLimit > 0 && (
                    <span>
                        Tempo limite: {exercise.timeLimit} min
                    </span>
                )}
            </div>

            {totalQuestions > 0 && (
                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
                Progresso
            </span>

                        <span className="text-slate-500">
                {answeredQuestions}/{totalQuestions} respondidas
            </span>
                    </div>
                    {exerciseCompleted && (
                        <div
                            className={`mt-4 rounded-lg border p-4 ${
                                passed
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-red-200 bg-red-50"
                            }`}
                        >
                            <p
                                className={`font-semibold ${
                                    passed
                                        ? "text-emerald-700"
                                        : "text-red-700"
                                }`}
                            >
                                {passed
                                    ? "Exercício concluído!"
                                    : "Pontuação insuficiente"}
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                                Você acertou {correctAnswers} de{" "}
                                {totalQuestions} questões e obteve{" "}
                                <strong>{score}%</strong>.
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                                Pontuação mínima para aprovação:{" "}
                                <strong>{exercise.passingScore}%</strong>.
                            </p>
                        </div>
                    )}

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                                width: `${
                                    (answeredQuestions / totalQuestions) * 100
                                }%`,
                            }}
                        />
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                        Pontuação atual:{" "}
                        <span className="font-semibold">
                {score}%
            </span>
                    </p>
                </div>
            )}

            <div className="mt-6 border-t border-slate-200 pt-5">
                {loading && (
                    <p className="text-sm text-slate-500">
                        Carregando perguntas...
                    </p>
                )}

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && questions.length === 0 && (
                    <p className="text-sm text-slate-500">
                        Este exercício ainda não possui perguntas.
                    </p>
                )}

                {!loading && !error && questions.length > 0 && (
                    <div className="space-y-4">
                        {questions.map((question, questionIndex) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                index={questionIndex}
                                onAnswer={handleAnswer}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function ExerciseSection({ exercises, onExerciseComplete, } : ExerciseSectionProps) {
    if (exercises.length === 0) {
        return (
            <p className="text-sm text-slate-500">
                Nenhum exercício disponível para esta aula.
            </p>
        );
    }

    return (
        <div className="space-y-4">
                {exercises.map((exercise, index) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                        onExerciseComplete={onExerciseComplete}
                    />
                    ))}
            </div>
    );
}