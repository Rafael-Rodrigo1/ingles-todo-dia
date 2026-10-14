
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getLessonById } from "../../../services/lessonService";
import {
    getLessonSectionsByLesson,
    createLessonSection,
    updateLessonSection,
    deleteLessonSection,
} from "../../../services/lessonSectionService";

import type { Lesson } from "../../../types/lesson";
import type {
    LessonSection,
    LessonSectionRequest,
    SectionType,
} from "../../../types/lessonSection";

const SECTION_TYPES: { value: SectionType; label: string }[] = [
    { value: "THEORY", label: "Teoria" },
    { value: "GRAMMAR", label: "Gramática" },
    { value: "EXAMPLE", label: "Exemplo" },
    { value: "VOCABULARY", label: "Vocabulário" },
    { value: "DIALOGUE", label: "Diálogo" },
    { value: "EXERCISE", label: "Exercício" },
    { value: "QUIZ", label: "Questionário" },
];

function emptyForm(lessonId: number): LessonSectionRequest {
    return {
        title: "",
        content: "",
        type: "THEORY",
        orderIndex: 1,
        lessonId,
    };
}

export default function AdminLessonSectionsPage() {
    const { lessonId: lessonIdParam } = useParams();
    const lessonId = Number(lessonIdParam);
    const validLessonId = Number.isSafeInteger(lessonId) && lessonId > 0;

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [sections, setSections] = useState<LessonSection[]>([]);
    const [form, setForm] = useState<LessonSectionRequest>(
        emptyForm(lessonId)
    );

    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadData() {
        if (!validLessonId) {
            setError("Identificador da lição inválido.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [lessonData, sectionData] = await Promise.all([
                getLessonById(lessonId),
                getLessonSectionsByLesson(lessonId),
            ]);

            setLesson(lessonData);
            setSections(
                [...sectionData].sort(
                    (a, b) => a.orderIndex - b.orderIndex
                )
            );
        } catch {
            setError("Não foi possível carregar o conteúdo da lição.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadData();
    }, [lessonId]);

    function resetForm() {
        setEditingId(null);
        setForm({
            ...emptyForm(lessonId),
            orderIndex: sections.length + 1,
        });
    }

    function startEditing(section: LessonSection) {
        setEditingId(section.id);
        setForm({
            title: section.title,
            content: section.content ?? "",
            type: section.type,
            orderIndex: section.orderIndex,
            lessonId: section.lessonId,
        });
        setError("");
        setSuccess("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.title.trim()) {
            setError("Informe o título da seção.");
            return;
        }

        if (!Number.isInteger(form.orderIndex) || form.orderIndex < 0) {
            setError("Informe uma ordem válida.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload: LessonSectionRequest = {
                ...form,
                title: form.title.trim(),
                lessonId,
            };

            if (editingId !== null) {
                await updateLessonSection(editingId, payload);
                setSuccess("Seção atualizada com sucesso.");
            } else {
                await createLessonSection(payload);
                setSuccess("Seção criada com sucesso.");
            }

            const updatedSections = await getLessonSectionsByLesson(lessonId);
            setSections(
                [...updatedSections].sort(
                    (a, b) => a.orderIndex - b.orderIndex
                )
            );

            setEditingId(null);
            setForm({
                ...emptyForm(lessonId),
                orderIndex: updatedSections.length + 1,
            });
        } catch {
            setError("Não foi possível salvar a seção.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(section: LessonSection) {
        const confirmed = window.confirm(
            `Deseja excluir a seção "${section.title}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(section.id);
            setError("");
            setSuccess("");

            await deleteLessonSection(section.id);

            setSections((current) =>
                current.filter((item) => item.id !== section.id)
            );

            if (editingId === section.id) {
                resetForm();
            }

            setSuccess("Seção excluída com sucesso.");
        } catch {
            setError("Não foi possível excluir a seção.");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return <p className="p-6">Carregando conteúdo da lição...</p>;
    }

    if (!validLessonId || !lesson) {
        return (
            <div className="p-6">
                <p className="text-red-600">
                    {error || "Lição não encontrada."}
                </p>
                <Link to="/admin/lessons" className="text-blue-600 underline">
                    Voltar para lições
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8 p-6">
            <div>
                <Link
                    to="/admin/lessons"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Voltar para lições
                </Link>

                <h1 className="mt-3 text-2xl font-bold">
                    Conteúdo da aula: {lesson.title}
                </h1>

                <p className="mt-1 text-gray-600">
                    Cadastre e organize as seções exibidas para os alunos.
                </p>
            </div>

            {error && (
                <p role="alert" className="rounded bg-red-100 p-3 text-red-700">
                    {error}
                </p>
            )}

            {success && (
                <p role="status" className="rounded bg-green-100 p-3 text-green-700">
                    {success}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl border p-6"
            >
                <h2 className="text-xl font-semibold">
                    {editingId !== null ? "Editar seção" : "Nova seção"}
                </h2>

                <div>
                    <label htmlFor="section-title" className="mb-1 block">
                        Título
                    </label>
                    <input
                        id="section-title"
                        type="text"
                        required
                        value={form.title}
                        onChange={(event) =>
                            setForm({ ...form, title: event.target.value })
                        }
                        className="w-full rounded border p-2"
                        placeholder="Ex.: O que é Simple Present?"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="section-type" className="mb-1 block">
                            Tipo de conteúdo
                        </label>
                        <select
                            id="section-type"
                            value={form.type}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    type: event.target.value as SectionType,
                                })
                            }
                            className="w-full rounded border p-2"
                        >
                            {SECTION_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="section-order" className="mb-1 block">
                            Ordem
                        </label>
                        <input
                            id="section-order"
                            type="number"
                            min="0"
                            step="1"
                            required
                            value={form.orderIndex}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    orderIndex: Number(event.target.value),
                                })
                            }
                            className="w-full rounded border p-2"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="section-content" className="mb-1 block">
                        Conteúdo
                    </label>
                    <textarea
                        id="section-content"
                        rows={10}
                        value={form.content}
                        onChange={(event) =>
                            setForm({ ...form, content: event.target.value })
                        }
                        className="w-full rounded border p-2"
                        placeholder="Escreva a explicação, exemplos ou diálogo..."
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Salvando..."
                            : editingId !== null
                                ? "Salvar alterações"
                                : "Criar seção"}
                    </button>

                    {editingId !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded border px-5 py-2"
                        >
                            Cancelar edição
                        </button>
                    )}
                </div>
            </form>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">
                    Seções cadastradas ({sections.length})
                </h2>

                {sections.length === 0 ? (
                    <p className="rounded border p-5 text-gray-600">
                        Esta aula ainda não possui seções cadastradas.
                    </p>
                ) : (
                    sections.map((section) => (
                        <div
                            key={section.id}
                            className="rounded-xl border p-5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Ordem {section.orderIndex} · {section.type}
                                    </p>
                                    <h3 className="mt-1 font-semibold">
                                        {section.title}
                                    </h3>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                                        {section.content || "Sem conteúdo textual."}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => startEditing(section)}
                                        className="rounded border px-3 py-2"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        disabled={deletingId !== null}
                                        onClick={() => void handleDelete(section)}
                                        className="rounded border border-red-500 px-3 py-2 text-red-600 disabled:opacity-50"
                                    >
                                        {deletingId === section.id
                                            ? "Excluindo..."
                                            : "Excluir"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}
