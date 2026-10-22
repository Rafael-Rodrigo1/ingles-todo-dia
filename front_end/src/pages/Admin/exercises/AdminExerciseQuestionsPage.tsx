
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
    createQuestion,
    deleteQuestion,
    getQuestionsByExerciseForAdmin,
    updateQuestion,
} from "../../../services/questionService";
import type {
    QuestionAdmin,
    QuestionRequest,
} from "../../../types/question";

const initialForm = {
    statement: "",
    explanation: "",
    orderIndex: 1,
    imageUrl: "",
    audioUrl: "",
    points: 10,
};

export function AdminExerciseQuestionsPage() {
    const { exerciseId } = useParams();
    const id = Number(exerciseId);

    const [questions, setQuestions] = useState<QuestionAdmin[]>([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!Number.isSafeInteger(id) || id <= 0) {
            setError("Exercício inválido.");
            setLoading(false);
            return;
        }

        async function loadQuestions() {
            try {
                const data = await getQuestionsByExerciseForAdmin(id);
                setQuestions(
                    [...data].sort((a, b) => a.orderIndex - b.orderIndex)
                );
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar as perguntas.");
            } finally {
                setLoading(false);
            }
        }

        void loadQuestions();
    }, [id]);

    function resetForm() {
        setForm(initialForm);
        setEditingId(null);
    }

    function handleEdit(question: QuestionAdmin) {
        setEditingId(question.id);
        setForm({
            statement: question.statement,
            explanation: question.explanation ?? "",
            orderIndex: question.orderIndex,
            imageUrl: question.imageUrl ?? "",
            audioUrl: question.audioUrl ?? "",
            points: question.points,
        });
        setError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!Number.isSafeInteger(id) || id <= 0) return;

        setSaving(true);
        setError("");

        const payload: QuestionRequest = {
            ...form,
            explanation: form.explanation.trim() || null,
            imageUrl: form.imageUrl.trim() || null,
            audioUrl: form.audioUrl.trim() || null,
            exerciseId: id,
        };

        try {

            if (editingId !== null) {
                await updateQuestion(editingId, payload);
            } else {
                await createQuestion(payload);
            }

            const updatedQuestions =
                await getQuestionsByExerciseForAdmin(id);

            setQuestions(
                [...updatedQuestions].sort(
                    (a, b) => a.orderIndex - b.orderIndex
                )
            );

            resetForm();
        } catch (err) {
            console.error(err);
            setError("Não foi possível salvar a pergunta.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(question: QuestionAdmin) {
        if (!window.confirm(`Excluir a pergunta "${question.statement}"?`)) {
            return;
        }

        try {
            setError("");
            await deleteQuestion(question.id);
            setQuestions((current) =>
                current.filter((item) => item.id !== question.id)
            );

            if (editingId === question.id) resetForm();
        } catch (err) {
            console.error(err);
            setError("Não foi possível excluir a pergunta.");
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <Link
                    to="/admin/exercises"
                    className="text-sm font-medium text-blue-600"
                >
                    ← Voltar para exercícios
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                    Gerenciar perguntas
                </h1>
                <p className="mt-2 text-slate-600">
                    Cadastre as perguntas deste exercício.
                </p>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </p>
            )}

            {Number.isSafeInteger(id) && id > 0 && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border bg-white p-6"
                >
                    <h2 className="text-xl font-semibold">
                        {editingId !== null ? "Editar pergunta" : "Nova pergunta"}
                    </h2>

                    <div>
                        <label className="mb-2 block font-medium">
                            Enunciado
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={form.statement}
                            onChange={(e) =>
                                setForm({ ...form, statement: e.target.value })
                            }
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Explicação
                        </label>
                        <textarea
                            rows={3}
                            value={form.explanation}
                            onChange={(e) =>
                                setForm({ ...form, explanation: e.target.value })
                            }
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block font-medium">
                                Ordem
                            </label>
                            <input
                                type="number"
                                min={0}
                                required
                                value={form.orderIndex}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        orderIndex: Number(e.target.value),
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-medium">
                                Pontos
                            </label>
                            <input
                                type="number"
                                min={1}
                                required
                                value={form.points}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        points: Number(e.target.value),
                                    })
                                }
                                className="w-full rounded-lg border p-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            URL da imagem (opcional)
                        </label>
                        <input
                            value={form.imageUrl}
                            onChange={(e) =>
                                setForm({ ...form, imageUrl: e.target.value })
                            }
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            URL do áudio (opcional)
                        </label>
                        <input
                            value={form.audioUrl}
                            onChange={(e) =>
                                setForm({ ...form, audioUrl: e.target.value })
                            }
                            className="w-full rounded-lg border p-3"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : "Salvar pergunta"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border px-5 py-3"
                            >
                                Cancelar edição
                            </button>
                        )}
                    </div>
                </form>
            )}

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Perguntas cadastradas</h2>

                {loading && <p>Carregando perguntas...</p>}

                {!loading && questions.length === 0 && (
                    <p className="text-slate-600">
                        Nenhuma pergunta cadastrada.
                    </p>
                )}

                {questions.map((question) => (
                    <div
                        key={question.id}
                        className="rounded-xl border bg-white p-5"
                    >
                        <p className="font-semibold">{question.statement}</p>
                        <p className="mt-2 text-sm text-slate-500">
                            Ordem: {question.orderIndex} | Pontos: {question.points}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4">
                            <button
                                type="button"
                                onClick={() => handleEdit(question)}
                                className="font-medium text-blue-600"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(question)}
                                className="font-medium text-red-600"
                            >
                                Excluir
                            </button>

                            <Link
                                to={`/admin/questions/${question.id}/alternatives`}
                                className="font-medium text-blue-600"
                            >
                                Gerenciar alternativas
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
