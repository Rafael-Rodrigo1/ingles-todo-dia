import {useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {createTag, deleteTag, getTags, updateTag } from "../../../services/tagService";
import type {Tag, TagRequest} from "../../../types/tag";

export function AdminTagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingTagId, setEditingTagId] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    useEffect(() => {
        async function loadTags() {
            try {
                const data = await getTags();

                setTags(data);
            } catch (error) {
                console.error(error);

                setError(
                    "Não foi possível carregar as tags."
                );
            } finally {
                setLoading(false);
            }
        }

        loadTags();
    }, []);

    function resetForm() {
        setName("");
        setSlug("");

        setEditingTagId(null);
        setShowForm(false);
    }

    function openCreateForm() {
        resetForm();
        setShowForm(true);
    }

    function handleEdit(tag: Tag) {
        setEditingTagId(tag.id);

        setName(tag.name);
        setSlug(tag.slug);

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

        setError("");
        setSaving(true);

        const data: TagRequest = {
            name,
            slug,
        };

        try {
            if (editingTagId !== null) {
                const updatedTag = await updateTag(
                    editingTagId,
                    data
                );

                setTags((current) =>
                    current.map((tag) =>
                        tag.id === editingTagId
                            ? updatedTag
                            : tag
                    )
                );
            } else {
                const createdTag =
                    await createTag(data);

                setTags((current) => [
                    ...current,
                    createdTag,
                ]);
            }

            resetForm();
        } catch (error) {
            console.error(error);

            setError(
                editingTagId !== null
                    ? "Não foi possível atualizar a tag."
                    : "Não foi possível criar a tag."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(tag: Tag) {
        const confirmed = window.confirm(
            `Deseja realmente excluir a tag "${tag.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteTag(tag.id);

            setTags((current) =>
                current.filter(
                    (item) => item.id !== tag.id
                )
            );

            if (editingTagId === tag.id) {
                resetForm();
            }
        } catch (error) {
            console.error(error);

            setError(
                "Não foi possível excluir a tag."
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
                            Tags
                        </h1>

                        <p className="mt-2 text-slate-600">
                            Gerencie as tags utilizadas
                            para organizar os conteúdos.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Nova tag
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingTagId !== null
                                    ? "Editar tag"
                                    : "Nova tag"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingTagId !== null
                                    ? "Atualize os dados da tag."
                                    : "Cadastre uma nova tag."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700"
                        >
                            Cancelar
                        </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Nome
                            </label>

                            <input
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                maxLength={60}
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
                                onChange={(e) =>
                                    setSlug(e.target.value)
                                }
                                maxLength={60}
                                required
                                placeholder="ex: phrasal-verbs"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Salvando..."
                                : editingTagId !== null
                                    ? "Salvar alterações"
                                    : "Salvar tag"}
                        </button>
                    </div>
                </form>
            )}

            {loading && (
                <p className="text-slate-600">
                    Carregando tags...
                </p>
            )}

            {!loading &&
                tags.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                        <p className="text-slate-600">
                            Nenhuma tag cadastrada.
                        </p>
                    </div>
                )}

            {!loading &&
                tags.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr className="text-left text-sm text-slate-600">
                                <th className="px-6 py-4">
                                    Nome
                                </th>

                                <th className="px-6 py-4">
                                    Slug
                                </th>

                                <th className="px-6 py-4">
                                    Ações
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200">
                            {tags.map((tag) => (
                                <tr key={tag.id}>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {tag.name}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {tag.slug}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        tag
                                                    )
                                                }
                                                className="font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        tag
                                                    )
                                                }
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