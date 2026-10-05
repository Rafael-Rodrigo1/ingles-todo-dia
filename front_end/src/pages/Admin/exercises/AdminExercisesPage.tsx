import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {createExercise, deleteExercise, getExercises, updateExercise} from "../../../services/exerciseService";
import { getLessons } from "../../../services/lessonService";
import type {Exercise, ExerciseDifficulty } from "../../../types/exercise";
import type { Lesson } from "../../../types/lesson";

export function AdminExercisesPage() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [passingScore, setPassingScore] = useState(70);
    const [orderIndex, setOrderIndex] = useState(0);
    const [active, setActive] = useState(true);
    const [timeLimit, setTimeLimit] = useState(10);
    const [difficulty, setDifficulty] = useState<ExerciseDifficulty>("EASY");
    const [lessonId, setLessonId] = useState<number | null>(null);
    const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);

    useEffect(() => {
        async function loadExercises() {
            try {
                const data = await getExercises();

                setExercises(
                    [...data].sort(
                        (a, b) =>
                            (a.orderIndex ?? 0) -
                            (b.orderIndex ?? 0)
                    )
                );
            } catch (error) {
                console.error(error);
                setError(
                    "Não foi possível carregar os exercícios."
                );
            } finally {
                setLoading(false);
            }
        }

        loadExercises();

        async function loadLessons() {
            try {
                const data = await getLessons();

                setLessons(data);

                if (data.length > 0) {
                    setLessonId(data[0].id);
                }
            } catch (error) {
                console.error(error);
                setError(
                    "Não foi possível carregar as lições."
                );
            }
        }

        loadLessons();
    }, []);

    function getDifficultyLabel(
        difficulty: Exercise["difficulty"]
    ) {
        switch (difficulty) {
            case "EASY":
                return "Fácil";

            case "MEDIUM":
                return "Médio";

            case "HARD":
                return "Difícil";

            default:
                return difficulty;
        }
    }

    function resetForm() {
        setTitle("");
        setDescription("");
        setPassingScore(70);
        setOrderIndex(0);
        setActive(true);
        setTimeLimit(10);
        setDifficulty("EASY");

        if (lessons.length > 0) {
            setLessonId(lessons[0].id);
        } else {
            setLessonId(null);
        }

        setEditingExerciseId(null);
    }

    function handleEdit(exercise: Exercise) {
        setEditingExerciseId(exercise.id);

        setTitle(exercise.title);
        setDescription(exercise.description ?? "");
        setPassingScore(exercise.passingScore);
        setOrderIndex(exercise.orderIndex);
        setActive(exercise.active);
        setTimeLimit(exercise.timeLimit);
        setDifficulty(exercise.difficulty);
        setLessonId(exercise.lessonId);

        setError("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (lessonId === null) {
            setError("Selecione uma lição.");
            return;
        }

        setError("");
        setSaving(true);

        const data = {
            title,
            description,
            passingScore,
            orderIndex,
            active,
            timeLimit,
            difficulty,
            lessonId,
        };

        try {
            if (editingExerciseId !== null) {
                const updatedExercise = await updateExercise(
                    editingExerciseId,
                    data
                );

                setExercises((current) =>
                    current
                        .map((exercise) =>
                            exercise.id === editingExerciseId
                                ? updatedExercise
                                : exercise
                        )
                        .sort(
                            (a, b) =>
                                (a.orderIndex ?? 0) -
                                (b.orderIndex ?? 0)
                        )
                );
            } else {
                const newExercise =
                    await createExercise(data);

                setExercises((current) =>
                    [...current, newExercise].sort(
                        (a, b) =>
                            (a.orderIndex ?? 0) -
                            (b.orderIndex ?? 0)
                    )
                );
            }

            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error(error);

            setError(
                editingExerciseId !== null
                    ? "Não foi possível atualizar o exercício."
                    : "Não foi possível criar o exercício."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(exercise: Exercise) {
        const confirmed = window.confirm(
            `Deseja realmente excluir o exercício "${exercise.title}"?`
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteExercise(exercise.id);

            setExercises((current) =>
                current.filter(
                    (item) => item.id !== exercise.id
                )
            );
        } catch (error) {
            console.error(error);
            setError(
                "Não foi possível excluir o exercício."
            );
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <Link
                    to="/admin"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Voltar para administração
                </Link>

                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Exercícios
                        </h1>

                        <p className="mt-2 text-slate-600">
                            Gerencie os exercícios das lições.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {resetForm(); setShowForm(true); }}
                        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Novo exercício
                    </button>
                </div>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingExerciseId !== null
                                    ? "Editar exercício"
                                    : "Novo exercício"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingExerciseId !== null
                                    ? "Altere os dados do exercício selecionado."
                                    : "Cadastre um exercício em uma lição."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {resetForm(); setShowForm(false); }}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700"
                        >
                            Cancelar
                        </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Título
                            </label>

                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Lição
                            </label>

                            <select
                                value={lessonId ?? ""}
                                onChange={(e) =>
                                    setLessonId(Number(e.target.value))
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                {lessons.map((lesson) => (
                                    <option
                                        key={lesson.id}
                                        value={lesson.id}
                                    >
                                        {lesson.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Descrição
                            </label>

                            <textarea
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows={4}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Dificuldade
                            </label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(
                                        e.target.value as ExerciseDifficulty
                                    )
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                <option value="EASY">Fácil</option>
                                <option value="MEDIUM">Médio</option>
                                <option value="HARD">Difícil</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Nota mínima
                            </label>

                            <input
                                type="number"
                                value={passingScore}
                                onChange={(e) =>
                                    setPassingScore(Number(e.target.value))
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Limite de tempo
                            </label>

                            <input
                                type="number"
                                min={0}
                                value={timeLimit}
                                onChange={(e) =>
                                    setTimeLimit(Number(e.target.value))
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Ordem
                            </label>

                            <input
                                type="number"
                                min={0}
                                value={orderIndex}
                                onChange={(e) =>
                                    setOrderIndex(Number(e.target.value))
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-3 pb-3">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) =>
                                        setActive(e.target.checked)
                                    }
                                />

                                <span className="text-sm font-medium text-slate-700">
                        Exercício ativo
                    </span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving || lessons.length === 0}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Salvando..."
                                : editingExerciseId !== null
                                    ? "Salvar alterações"
                                    : "Salvar exercício"}
                        </button>
                    </div>
                </form>
            )}

            {loading && (
                <p className="text-slate-600">
                    Carregando exercícios...
                </p>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {!loading &&
                !error &&
                exercises.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                        <p className="text-slate-600">
                            Nenhum exercício cadastrado.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                exercises.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr className="text-left text-sm text-slate-600">
                                <th className="px-6 py-4">
                                    Exercício
                                </th>

                                <th className="px-6 py-4">
                                    Lição
                                </th>

                                <th className="px-6 py-4">
                                    Dificuldade
                                </th>

                                <th className="px-6 py-4">
                                    Nota mínima
                                </th>

                                <th className="px-6 py-4">
                                    Tempo
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>

                                <th className="px-6 py-4">
                                    Ações
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                            {exercises.map((exercise) => (
                                <tr key={exercise.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">
                                            {exercise.title}
                                        </p>

                                        {exercise.description && (
                                            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                                {exercise.description}
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {exercise.lessonTitle}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {getDifficultyLabel(
                                            exercise.difficulty
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {exercise.passingScore}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {exercise.timeLimit}
                                    </td>

                                    <td className="px-6 py-4">
                                        {exercise.active ? (
                                            <span className="font-medium text-green-700">
                                                    Ativo
                                                </span>
                                        ) : (
                                            <span className="font-medium text-slate-500">
                                                    Inativo
                                                </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(exercise)}
                                                className="font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(exercise)}
                                                className="font-medium text-red-600 hover:text-red-700"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    );
}