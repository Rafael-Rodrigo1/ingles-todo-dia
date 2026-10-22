import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {createAlternative, deleteAlternative, getAlternativesByQuestionForAdmin, updateAlternative,} from "../../../services/alternativeService";
import type { AlternativeAdmin } from "../../../types/alternative";

export function AdminQuestionAlternativesPage() {
    const { questionId } = useParams();
    const id = Number(questionId);
    const validId = Number.isSafeInteger(id) && id > 0;

    const [alternatives, setAlternatives] = useState<AlternativeAdmin[]>([]);
    const [text, setText] = useState("");
    const [correct, setCorrect] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!validId) {
            setError("Pergunta inválida.");
            setLoading(false);
            return;
        }

        async function loadAlternatives() {
            setLoading(true);
            setError("");

            try {
                const data = await getAlternativesByQuestionForAdmin(id);
                setAlternatives(data);
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar as alternativas.");
            } finally {
                setLoading(false);
            }
        }

        void loadAlternatives();
    }, [id, validId]);

    function resetForm() {
        setText("");
        setCorrect(false);
        setEditingId(null);
    }

    function handleEdit(alternative: AlternativeAdmin)  {
        setEditingId(alternative.id);
        setText(alternative.text);
        setCorrect(alternative.correct);
        setError("");
        setMessage("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validId || !text.trim()) return;

        setError("");
        setMessage("");

        const anotherCorrectExists = alternatives.some(
            (item) => item.correct && item.id !== editingId
        );

        if (correct && anotherCorrectExists) {
            setError(
                "Já existe uma alternativa correta. Desmarque a anterior antes de selecionar outra."
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                text: text.trim(),
                correct,
                questionId: id,
            };


            if (editingId !== null) {
                await updateAlternative(editingId, payload);
            } else {
                await createAlternative(payload);
            }

            const updatedAlternatives =
                await getAlternativesByQuestionForAdmin(id);

            setAlternatives(updatedAlternatives);


            resetForm();
            setMessage("Alternativa salva com sucesso.");
        } catch (err) {
            console.error(err);
            setError("Não foi possível salvar a alternativa.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(alternative: AlternativeAdmin) {
        if (!window.confirm(`Excluir "${alternative.text}"?`)) return;

        setError("");
        setMessage("");

        try {
            await deleteAlternative(alternative.id);

            setAlternatives((current) =>
                current.filter((item) => item.id !== alternative.id)
            );

            if (editingId === alternative.id) resetForm();

            setMessage("Alternativa excluída.");
        } catch (err) {
            console.error(err);
            setError("Não foi possível excluir a alternativa.");
        }
    }

    const correctCount = alternatives.filter(
        (item) => item.correct
    ).length;

    const ready = alternatives.length >= 2 && correctCount === 1;

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
                    Gerenciar alternativas
                </h1>

                <p className="mt-2 text-slate-600">
                    Cadastre as opções de resposta da pergunta.
                </p>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </p>
            )}

            {message && (
                <p className="rounded-lg bg-green-50 p-4 text-green-700">
                    {message}
                </p>
            )}

            {!loading && (
                <div className="rounded-lg border bg-white p-4">
                    <p className="font-medium">
                        Status: {ready ? "Pronta para revisão" : "Incompleta"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                        {alternatives.length} alternativas cadastradas;
                        {" "}{correctCount} marcada(s) como correta(s).
                    </p>
                    {!ready && (
                        <p className="mt-2 text-sm text-amber-700">
                            Cadastre pelo menos duas alternativas e marque
                            exatamente uma como correta.
                        </p>
                    )}
                </div>
            )}

            {validId && (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border bg-white p-6"
                >
                    <h2 className="text-xl font-semibold">
                        {editingId !== null
                            ? "Editar alternativa"
                            : "Nova alternativa"}
                    </h2>

                    <div>
                        <label className="mb-2 block font-medium">
                            Texto da alternativa
                        </label>
                        <input
                            required
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full rounded-lg border p-3"
                            placeholder="Ex.: studies"
                        />
                    </div>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={correct}
                            onChange={(e) => setCorrect(e.target.checked)}
                        />
                        <span className="font-medium">
                            Esta é a resposta correta
                        </span>
                    </label>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving || loading}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : "Salvar alternativa"}
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
                <h2 className="text-xl font-semibold">
                    Alternativas cadastradas
                </h2>

                {loading && <p>Carregando alternativas...</p>}

                {!loading && alternatives.length === 0 && (
                    <p className="text-slate-600">
                        Nenhuma alternativa cadastrada.
                    </p>
                )}

                {alternatives.map((alternative) => (
                    <div
                        key={alternative.id}
                        className="rounded-xl border bg-white p-5"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-medium">{alternative.text}</p>

                            <span
                                className={
                                    alternative.correct
                                        ? "text-sm font-semibold text-green-700"
                                        : "text-sm text-slate-500"
                                }
                            >
                                {alternative.correct
                                    ? "Correta"
                                    : "Incorreta"}
                            </span>
                        </div>

                        <div className="mt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleEdit(alternative)}
                                className="font-medium text-blue-600"
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(alternative)}
                                className="font-medium text-red-600"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
