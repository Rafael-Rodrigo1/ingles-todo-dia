import type { Exercise } from "../../types/exercise";
import { useEffect, useRef, useState } from "react";
import { getQuestionsByExercise } from "../../services/questionService";
import type { UserExerciseProgress } from "../../types/userExerciseProgress";
import type { Question } from "../../types/question";
import { QuestionCard } from "./QuestionCard";

interface ExerciseSectionProps {
    exercises: Exercise[];
    completedExercises: Record<number, number>;
    onExerciseComplete?: (
        exerciseId: number,
        answers: { questionId: number; alternativeId: number }[]
    ) => Promise<UserExerciseProgress>;
}

interface ExerciseCardProps {
    exercise: Exercise;
    index: number;
    savedScore?: number;
    onExerciseComplete?: (
        exerciseId: number,
        answers: { questionId: number; alternativeId: number }[]
    ) => Promise<UserExerciseProgress>;
}

function ExerciseCard({exercise, index, savedScore, onExerciseComplete, } : ExerciseCardProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const completionSent = useRef(false);
    const [attempt, setAttempt] = useState(0);
    const [retrying, setRetrying] = useState(false);
    const [attemptResult, setAttemptResult] =
        useState<UserExerciseProgress | null>(null);

    const [submitting, setSubmitting] = useState(false);

    const [submitError, setSubmitError] = useState("");
    const showSavedResult = savedScore !== undefined && !retrying && attemptResult === null;

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
        alternativeId: number
    ) {
        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [questionId]: alternativeId,
        }));
    }

    const answeredQuestions = Object.keys(answers).length;

    const totalQuestions = questions.length;

    const exerciseCompleted =
        totalQuestions > 0 &&
        answeredQuestions === totalQuestions;


    useEffect(() => {
        if (
            !exerciseCompleted ||
            completionSent.current ||
            !onExerciseComplete
        ) {
            return;
        }

        completionSent.current = true;

        const selectedAnswers = Object.entries(answers).map(
            ([questionId, alternativeId]) => ({
                questionId: Number(questionId),
                alternativeId,
            })
        );

        async function submitAnswers() {
            setSubmitting(true);
            setSubmitError("");
            setAttemptResult(null);

            try {
                const result = await onExerciseComplete!(
                    exercise.id,
                    selectedAnswers
                );

                setAttemptResult(result);
            } catch (error) {
                console.error("Erro ao enviar respostas:", error);

                setSubmitError(
                    "Não foi possível corrigir o exercício. Tente novamente."
                );
            } finally {
                setSubmitting(false);
            }
        }

        void submitAnswers();
    }, [exerciseCompleted, exercise.id, answers, onExerciseComplete]);


    function handleRetry() {
        if (submitting) {
            return;
        }

        setRetrying(true);
        setAnswers({});
        setAttemptResult(null);
        setSubmitError("");
        setSubmitting(false);

        completionSent.current = false;

        setAttempt((current) => current + 1);
    }

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

            {showSavedResult && (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <p className="font-semibold text-emerald-700">Exercício aprovado!</p>
                    <p className="mt-1 text-sm text-slate-700">Melhor nota registrada: <strong>{savedScore}%</strong>.</p>
                    <p className="mt-1 text-sm text-slate-600">Progresso salvo. Você pode refazer o exercício sem perder a aprovação.</p>
                    <button type="button" onClick={handleRetry} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Refazer exercício
                    </button>
                </div>
            )}

            {!showSavedResult && totalQuestions > 0 && (
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
                        <div className="mt-4 space-y-3">

                            {submitting && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <p className="font-semibold text-blue-700">
                                        Corrigindo exercício...
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Aguarde enquanto o servidor verifica suas respostas.
                                    </p>
                                </div>
                            )}

                            {submitError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <p className="font-semibold text-red-700">
                                        Erro ao corrigir exercício
                                    </p>

                                    <p className="mt-1 text-sm text-red-600">
                                        {submitError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleRetry}
                                        disabled={submitting}
                                        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Tentar novamente
                                    </button>
                                </div>
                            )}

                            {attemptResult && (
                                <div
                                    className={`rounded-lg border p-4 ${
                                        attemptResult.attemptPassed
                                            ? "border-emerald-200 bg-emerald-50"
                                            : "border-amber-200 bg-amber-50"
                                    }`}

                                >
                                    <p className="text-lg font-semibold">
                                        {attemptResult.attemptPassed
                                            ? "Exercício aprovado!"
                                            : "Exercício não aprovado"}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        Nota desta tentativa:{" "}
                                        <strong>{attemptResult.attemptScore}%</strong>
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Nota mínima:{" "}
                                        <strong>{exercise.passingScore}%</strong>
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Melhor nota registrada:{" "}
                                        <strong>{attemptResult.score}%</strong>
                                    </p>

                                    <p className="mt-1 text-sm">
                                        Tentativas realizadas:{" "}
                                        <strong>{attemptResult.attempts}</strong>
                                    </p>

                                    {!attemptResult.attemptPassed &&
                                        attemptResult.completed && (
                                            <p className="mt-3 text-sm text-emerald-700">
                                                Sua aprovação anterior foi preservada.
                                            </p>
                                        )}

                                    <button
                                        type="button"
                                        onClick={handleRetry}
                                        disabled={submitting}
                                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Refazer exercício
                                    </button>
                                </div>
                            )}
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
                </div>
            )}

            {!showSavedResult && <div className="mt-6 border-t border-slate-200 pt-5">
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
                                key={`${question.id}-${attempt}`}
                                question={question}
                                index={questionIndex}
                                onAnswer={handleAnswer}
                            />
                        ))}
                    </div>
                )}
            </div>}
        </div>
    );
}

export function ExerciseSection({ exercises, completedExercises, onExerciseComplete, } : ExerciseSectionProps) {
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
                        savedScore={completedExercises[exercise.id]}
                        onExerciseComplete={onExerciseComplete}
                    />
                    ))}
            </div>
    );
}