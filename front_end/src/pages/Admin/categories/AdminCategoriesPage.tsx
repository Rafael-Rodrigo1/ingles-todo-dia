import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {createCategory, deleteCategory, getCategories, updateCategory,} from "../../../services/categoryService";
import type { Category } from "../../../types/category";

export function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");
    const [color, setColor] = useState("");
    const [orderIndex, setOrderIndex] = useState(0);
    const [active, setActive] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error(error);
                setError("Não foi possível carregar as categorias.");
            } finally {
                setLoading(false);
            }
        }

        loadCategories();
    }, []);

    function resetForm() {
        setName("");
        setSlug("");
        setDescription("");
        setIcon("");
        setColor("");
        setOrderIndex(0);
        setActive(true);
        setEditingCategoryId(null);
    }

    function handleEdit(category: Category) {
        setEditingCategoryId(category.id);

        setName(category.name);
        setSlug(category.slug);
        setDescription(category.description ?? "");
        setIcon(category.icon ?? "");
        setColor(category.color ?? "");
        setOrderIndex(category.orderIndex ?? 0);
        setActive(category.active);

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

        setError("");
        setSaving(true);

        const data = {
            name,
            slug,
            description,
            icon,
            color,
            orderIndex,
            active,
        };

        try {
            if (editingCategoryId !== null) {
                const updatedCategory = await updateCategory(
                    editingCategoryId,
                    data
                );

                setCategories((current) =>
                    current
                        .map((category) =>
                            category.id === editingCategoryId
                                ? updatedCategory
                                : category
                        )
                        .sort(
                            (a, b) =>
                                (a.orderIndex ?? 0) -
                                (b.orderIndex ?? 0)
                        )
                );
            } else {
                const newCategory = await createCategory(data);

                setCategories((current) =>
                    [...current, newCategory].sort(
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
                editingCategoryId !== null
                    ? "Não foi possível atualizar a categoria."
                    : "Não foi possível criar a categoria."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(category: Category) {
        const confirmed = window.confirm(
            `Deseja realmente excluir a categoria "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteCategory(category.id);

            setCategories((current) =>
                current.filter((item) => item.id !== category.id)
            );
        } catch (error) {
            console.error(error);
            setError("Não foi possível excluir a categoria.");
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
                            Categorias
                        </h1>

                        <p className="mt-2 text-slate-600">
                            Gerencie as categorias das lições.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Nova categoria
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
                                {editingCategoryId !== null
                                    ? "Editar categoria"
                                    : "Nova categoria"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingCategoryId !== null
                                    ? "Altere os dados da categoria selecionada."
                                    : "Cadastre uma nova categoria de conteúdo."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {resetForm();setShowForm(false);}}
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
                                onChange={(event) => setName(event.target.value)}
                                maxLength={80}
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
                                onChange={(event) => setSlug(event.target.value)}
                                maxLength={80}
                                required
                                placeholder="ex: gramatica"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Descrição
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                maxLength={255}
                                rows={3}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Ícone
                            </label>

                            <input
                                value={icon}
                                onChange={(event) => setIcon(event.target.value)}
                                maxLength={100}
                                placeholder="ex: book"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Cor
                            </label>

                            <input
                                value={color}
                                onChange={(event) => setColor(event.target.value)}
                                maxLength={20}
                                placeholder="ex: #2563EB"
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
                                onChange={(event) =>
                                    setOrderIndex(Number(event.target.value))
                                }
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-3 pb-3">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(event) =>
                                        setActive(event.target.checked)
                                    }
                                />

                                <span className="text-sm font-medium text-slate-700">
                        Categoria ativa
                    </span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {saving ? "Salvando..." : editingCategoryId !== null ? "Salvar alterações" : "Salvar categoria"}
                        </button>
                    </div>
                </form>
            )}

            {loading && (
                <p className="text-slate-600">
                    Carregando categorias...
                </p>
            )}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {!loading && !error && categories.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                    <p className="text-slate-600">
                        Nenhuma categoria cadastrada.
                    </p>
                </div>
            )}

            {!loading && !error && categories.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                        <tr className="text-left text-sm text-slate-600">
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Ordem</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Ações</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {category.name}
                                </td>

                                <td className="px-6 py-4 text-slate-600">
                                    {category.slug}
                                </td>

                                <td className="px-6 py-4 text-slate-600">
                                    {category.orderIndex ?? "-"}
                                </td>

                                <td className="px-6 py-4">
                                    {category.active ? (
                                        <span className="font-medium text-green-700">
                                                Ativa
                                            </span>
                                    ) : (
                                        <span className="font-medium text-slate-500">
                                                Inativa
                                            </span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(category)}
                                        className="font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Editar
                                    </button>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(category)}
                                            className="font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(category)}
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