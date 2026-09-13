import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getLessonById } from "../../services/lessonService";
import type { Lesson } from "../../types/lesson";
import { getLessonSectionsByLesson } from "../../services/lessonSectionService";
import type { LessonSection } from "../../types/lessonSection";
import { LessonSectionCard } from "../../components/lesson/LessonSectionCard";
import { getExercisesByLesson } from "../../services/exerciseService";
import type { Exercise } from "../../types/exercise";
import {getMyProgressByLesson, saveProgress,} from "../../services/progressService";
import type { UserProgress } from "../../types/userProgress";

export function LessonPage() {
    const { id } = useParams<{ id: string }>();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [sections, setSections] = useState<LessonSection[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [completedExercises, setCompletedExercises] = useState<Record<number, number>>({});
    const [savedProgress, setSavedProgress] = useState<UserProgress | null>(null);
    const lessonStartTime = useRef(Date.now());
    const accountedSessionTime = useRef(0);

    const exercisesCompleted = Object.keys(completedExercises).length;

    const completedScores =
        Object.values(completedExercises);

    const averageExerciseScore =
        completedScores.length > 0
            ? Math.round(
                completedScores.reduce(
                    (total, score) => total + score,
                    0
                ) / completedScores.length
            )
            : 0;

    const exerciseProgressPercentage =
        exercises.length > 0
            ? Math.round(
                (exercisesCompleted / exercises.length) * 100
            )
            : 0;

    const allExercisesCompleted =
        exercises.length > 0 &&
        exercisesCompleted === exercises.length;

    const progressData = lesson
        ? {
            lessonId: lesson.id,
            completed: allExercisesCompleted,
            score: averageExerciseScore,
            percentage: exerciseProgressPercentage,
            currentSection: sections.length,
            exercisesCompleted,
            totalStudyTime: 0,
        }
        : null;

    useEffect(() => {
        console.log(
            "Dados que serão enviados:",
            progressData
        );
        console.log("Progresso calculado:", {
            exercisesCompleted,
            totalExercises: exercises.length,
            averageExerciseScore,
            exerciseProgressPercentage,
        });
    }, [
        completedExercises,
        exercises.length,
        exercisesCompleted,
        averageExerciseScore,
        exerciseProgressPercentage,
    ]);

    useEffect(() => {
        async function loadLesson() {
            if (!id) {
                setError("Aula inválida.");
                setLoading(false);
                return;
            }

            const lessonId = Number(id);

            if (Number.isNaN(lessonId)) {
                setError("ID da aula inválido.");
                setLoading(false);
                return;
            }

            try {
                const [lessonData, sectionsData, exercisesData] = await Promise.all([
                        getLessonById(lessonId),
                        getLessonSectionsByLesson(lessonId),
                        getExercisesByLesson(lessonId),
                    ]);

                setLesson(lessonData);

                setSections(
                    [...sectionsData].sort(
                        (a, b) => a.orderIndex - b.orderIndex
                    )
                );
                setExercises(
                    [...exercisesData]
                        .filter((exercise) => exercise.active)
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                );

                try {
                    const progressData =
                        await getMyProgressByLesson(lessonId);

                    setSavedProgress(progressData);

                    console.log(
                        "Progresso da aula recebido:",
                        progressData
                    );
                } catch (error) {
                    setSavedProgress(null);

                    console.log(
                        "A aula ainda não possui progresso salvo."
                    );
                }

                console.log("Aula recebida:", lessonData);
                console.log("Seções recebidas:", sectionsData);
                console.log("Exercícios recebidos:", exercisesData);
            } catch (error) {
                console.error("Erro ao carregar aula:", error);
                setError("Não foi possível carregar esta aula.");
            } finally {
                setLoading(false);
            }
        }

        loadLesson();
    }, [id]);

    if (loading) {
        return (
            <p className="text-sm text-slate-500">
                Carregando aula...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-sm text-red-600">
                {error}
            </p>
        );
    }

    if (!lesson) {
        return (
            <p className="text-sm text-slate-500">
                Aula não encontrada.
            </p>
        );
    }

    async function handleExerciseComplete(
        exerciseId: number,
        score: number,
        passed: boolean
    ) {
        console.log("Exercício concluído:", {
            exerciseId,
            score,
            passed,
        });

        if (!lesson) {
            return;
        }

        const updatedExercises = {
            ...completedExercises,
            [exerciseId]: score,
        };

        setCompletedExercises(updatedExercises);

        const updatedScores = Object.values(updatedExercises);

        const updatedExercisesCompleted =
            Object.keys(updatedExercises).length;

        const updatedAverageScore =
            updatedScores.length > 0
                ? Math.round(
                    updatedScores.reduce(
                        (total, currentScore) =>
                            total + currentScore,
                        0
                    ) / updatedScores.length
                )
                : 0;

        const updatedPercentage =
            exercises.length > 0
                ? Math.round(
                    (updatedExercisesCompleted /
                        exercises.length) *
                    100
                )
                : 0;

        const updatedCompleted =
            exercises.length > 0 &&
            updatedExercisesCompleted === exercises.length;
        const currentSessionTime = Math.floor(
            (Date.now() - lessonStartTime.current) / 1000
        );

        const newStudyTime =
            currentSessionTime - accountedSessionTime.current;

        const previousStudyTime =
            savedProgress?.totalStudyTime ?? 0;

        const updatedTotalStudyTime =
            previousStudyTime + newStudyTime;


        const data = {
            lessonId: lesson.id,
            completed: updatedCompleted,
            score: updatedAverageScore,
            percentage: updatedPercentage,
            currentSection: sections.length,
            exercisesCompleted: updatedExercisesCompleted,
            totalStudyTime: updatedTotalStudyTime,
        };

        console.log("Enviando progresso:", data);


        try {
            console.log("Tempo de estudo:", {
                currentSessionTime,
                newStudyTime,
                previousStudyTime,
                updatedTotalStudyTime,
            });
            const updatedProgress = await saveProgress(data);

            accountedSessionTime.current = currentSessionTime;

            setSavedProgress(updatedProgress);

            console.log(
                "Progresso salvo:",
                updatedProgress
            );
        } catch (error) {
            console.error(
                "Erro ao salvar progresso:",
                error
            );
        }
    }

    return (
        <section className="space-y-8">
            <div>
                <p className="text-sm font-medium text-slate-500">
                    {lesson.categoryName}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {lesson.title}
                </h1>

                {lesson.shortDescription && (
                    <p className="mt-3 max-w-3xl text-lg text-slate-600">
                        {lesson.shortDescription}
                    </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        Nível: {lesson.level}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        Dificuldade: {lesson.difficulty}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {lesson.estimatedTime} min
                    </span>
                </div>
            </div>

            {lesson.thumbnail && (
                <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className="max-h-96 w-full rounded-xl object-cover"
                />
            )}

            {savedProgress && (
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Seu progresso
                            </p>

                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                {savedProgress.completed
                                    ? "Aula concluída"
                                    : "Aula em andamento"}
                            </p>
                        </div>

                        <span className="text-lg font-semibold text-blue-600">
                {Math.round(savedProgress.percentage)}%
            </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.max(0, savedProgress.percentage)
                                )}%`,
                            }}
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600">
            <span>
                Nota:{" "}
                <strong>{savedProgress.score}%</strong>
            </span>

                        <span>
                Exercícios concluídos:{" "}
                            <strong>
                    {savedProgress.exercisesCompleted}
                </strong>
            </span>
                    </div>
                </section>
            )}

            {lesson.description && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Sobre esta aula
                    </h2>

                    <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                        {lesson.description}
                    </p>
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        Conteúdo
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        Conteúdo da aula
                    </h2>
                </div>

                {sections.map((section, index) => (
                    <LessonSectionCard
                        key={section.id}
                        section={section}
                        index={index}
                        exercises={exercises}
                        onExerciseComplete={handleExerciseComplete}
                    />
                ))}
            </div>
        </section>
    );
}