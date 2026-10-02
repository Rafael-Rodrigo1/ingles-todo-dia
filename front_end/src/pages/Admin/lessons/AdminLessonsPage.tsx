import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../../services/categoryService";
import {createLesson, deleteLesson, getLessons, updateLesson,} from "../../../services/lessonService";
import type { Category } from "../../../types/category";
import type {Difficulty, EnglishLevel, Lesson,} from "../../../types/lesson";

export function AdminLessonsPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
    const [level, setLevel] = useState<EnglishLevel>("A1");
    const [estimatedTime, setEstimatedTime] = useState(10);
    const [thumbnail, setThumbnail] = useState("");
    const [published, setPublished] = useState(false);
    const [orderIndex, setOrderIndex] = useState(0);
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

    useEffect(() => {
        async function loadLessons() {
            try {
                const data = await getLessons();

                setLessons(
                    [...data].sort(
                        (a, b) =>
                            (a.orderIndex ?? 0) -
                            (b.orderIndex ?? 0)
                    )
                );
            } catch (error) {
                console.error(error);
                setError(
                    "Não foi possível carregar as lições."
                );
            } finally {
                setLoading(false);
            }
        }

        loadLessons();

        async function loadCategories() {
            try {
                const data = await getCategories();
                setCategories(data);

                if (data.length > 0) {
                    setCategoryId(data[0].id);
                }
            } catch (error) {
                console.error(error);
                setError("Não foi possível carregar as categorias.");
            }
        }

        loadCategories();
    }, []);

    function resetForm() {
        setTitle("");
        setSlug("");
        setDescription("");
        setShortDescription("");
        setDifficulty("EASY");
        setLevel("A1");
        setEstimatedTime(10);
        setThumbnail("");
        setPublished(false);
        setOrderIndex(0);

        if (categories.length > 0) {
            setCategoryId(categories[0].id);
        } else {
            setCategoryId(null);
        }

        setEditingLessonId(null);
    }

    function handleEdit(lesson: Lesson) {
        console.log("EDITAR CLICADO:", lesson);

        setEditingLessonId(lesson.id);

        setTitle(lesson.title);
        setSlug(lesson.slug);
        setDescription(lesson.description ?? "");
        setShortDescription(lesson.shortDescription ?? "");
        setDifficulty(lesson.difficulty);
        setLevel(lesson.level);
        setEstimatedTime(lesson.estimatedTime);
        setThumbnail(lesson.thumbnail ?? "");
        setPublished(lesson.published ?? false);
        setOrderIndex(lesson.orderIndex ?? 0);
        setCategoryId(lesson.categoryId);

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

        if (categoryId === null) {
            setError("Selecione uma categoria.");
            return;
        }

        setError("");
        setSaving(true);

        const data = {
            title,
            slug,
            description,
            shortDescription,
            difficulty,
            level,
            estimatedTime,
            thumbnail,
            published,
            orderIndex,
            categoryId,
        };

        try {
            if (editingLessonId !== null) {
                const updatedLesson = await updateLesson(
                    editingLessonId,
                    data
                );

                setLessons((current) =>
                    current
                        .map((lesson) =>
                            lesson.id === editingLessonId
                                ? updatedLesson
                                : lesson
                        )
                        .sort(
                            (a, b) =>
                                (a.orderIndex ?? 0) -
                                (b.orderIndex ?? 0)
                        )
                );
            } else {
                const newLesson = await createLesson(data);

                setLessons((current) =>
                    [...current, newLesson].sort(
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
                editingLessonId !== null
                    ? "Não foi possível atualizar a lição."
                    : "Não foi possível criar a lição."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(lesson: Lesson) {
        const confirmed = window.confirm(
            `Deseja realmente excluir a lição "${lesson.title}"?`
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteLesson(lesson.id);

            setLessons((current) =>
                current.filter(
                    (item) => item.id !== lesson.id
                )
            );
        } catch (error) {
            console.error(error);
            setError("Não foi possível excluir a lição.");
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
                            Lições
                        </h1>

                        <p className="mt-2 text-slate-600">
                            Gerencie as lições da plataforma.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {resetForm(); setShowForm(true);}}
                        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Nova lição
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
                                {editingLessonId !== null
                                    ? "Editar lição"
                                    : "Nova lição"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingLessonId !== null
                                    ? "Altere os dados da lição selecionada."
                                    : "Cadastre uma nova lição na plataforma."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {resetForm(); setShowForm(false);}}
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
                                Slug
                            </label>

                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                placeholder="ex: simple-present"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Descrição curta
                            </label>

                            <input
                                value={shortDescription}
                                onChange={(e) =>
                                    setShortDescription(e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
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
                                maxLength={500}
                                rows={4}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Categoria
                            </label>

                            <select
                                value={categoryId ?? ""}
                                onChange={(e) =>
                                    setCategoryId(Number(e.target.value))
                                }
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Nível de inglês
                            </label>

                            <select
                                value={level}
                                onChange={(e) =>
                                    setLevel(e.target.value as EnglishLevel)
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                {["A1", "A2", "B1", "B2", "C1", "C2"].map(
                                    (item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Dificuldade
                            </label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(
                                        e.target.value as Difficulty
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
                                Tempo estimado (minutos)
                            </label>

                            <input
                                type="number"
                                min={1}
                                value={estimatedTime}
                                onChange={(e) =>
                                    setEstimatedTime(Number(e.target.value))
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
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Thumbnail
                            </label>

                            <input
                                value={thumbnail}
                                onChange={(e) =>
                                    setThumbnail(e.target.value)
                                }
                                placeholder="URL da imagem"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-3 pb-3">
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={(e) =>
                                        setPublished(e.target.checked)
                                    }
                                />

                                <span className="text-sm font-medium text-slate-700">
                        Publicar lição
                    </span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving || categories.length === 0}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Salvando..." : editingLessonId !== null ? "Salvar alterações" : "Salvar lição"}
                        </button>
                    </div>
                </form>
            )}

            {loading && (
                <p className="text-slate-600">
                    Carregando lições...
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
                lessons.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                        <p className="text-slate-600">
                            Nenhuma lição cadastrada.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                lessons.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr className="text-left text-sm text-slate-600">
                                <th className="px-6 py-4">
                                    Lição
                                </th>

                                <th className="px-6 py-4">
                                    Categoria
                                </th>

                                <th className="px-6 py-4">
                                    Nível
                                </th>

                                <th className="px-6 py-4">
                                    Dificuldade
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
                            {lessons.map((lesson) => (
                                <tr key={lesson.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">
                                            {lesson.title}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {lesson.slug}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {lesson.categoryName}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {lesson.level}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {lesson.difficulty}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {lesson.estimatedTime} min
                                    </td>

                                    <td className="px-6 py-4">
                                        {lesson.published ? (
                                            <span className="font-medium text-green-700">
                                                    Publicada
                                                </span>
                                        ) : (
                                            <span className="font-medium text-slate-500">
                                                    Rascunho
                                                </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(lesson)}
                                                className="font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(lesson)}
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