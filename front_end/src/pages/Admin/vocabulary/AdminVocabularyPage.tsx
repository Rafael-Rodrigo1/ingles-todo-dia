import {
    useEffect,
    useState,
    type FormEvent,
} from "react";
import { Link } from "react-router-dom";

import {
    createVocabularyCategory,
    deleteVocabularyCategory,
    getVocabularyCategories,
    updateVocabularyCategory,
} from "../../../services/vocabularyCategoryService";

import {
    createVocabularyWord,
    deleteVocabularyWord,
    getVocabularyWords,
    updateVocabularyWord,
} from "../../../services/vocabularyWordService";

import type {
    VocabularyCategory,
    VocabularyWord,
    VocabularyEnglishLevel,
} from "../../../types/vocabulary";

export function AdminVocabularyPage() {
    const [categories, setCategories] =
        useState<VocabularyCategory[]>([]);

    const [words, setWords] =
        useState<VocabularyWord[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // CATEGORY FORM
    // =========================

    const [showCategoryForm, setShowCategoryForm] =
        useState(false);

    const [savingCategory, setSavingCategory] =
        useState(false);

    const [
        editingCategoryId,
        setEditingCategoryId,
    ] = useState<number | null>(null);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");
    const [active, setActive] = useState(true);
    const [orderIndex, setOrderIndex] = useState(0);

    // =========================
    // WORD FORM
    // =========================

    const [showWordForm, setShowWordForm] =
        useState(false);

    const [savingWord, setSavingWord] =
        useState(false);

    const [
        editingWordId,
        setEditingWordId,
    ] = useState<number | null>(null);

    const [english, setEnglish] = useState("");
    const [portuguese, setPortuguese] = useState("");
    const [pronunciation, setPronunciation] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [exampleEnglish, setExampleEnglish] =
        useState("");
    const [examplePortuguese, setExamplePortuguese] =
        useState("");
    const [observation, setObservation] = useState("");

    const [level, setLevel] =
        useState<VocabularyEnglishLevel | "">("");

    const [wordCategoryId, setWordCategoryId] =
        useState<number | "">("");

    useEffect(() => {
        async function loadData() {
            try {
                const [
                    categoriesData,
                    wordsData,
                ] = await Promise.all([
                    getVocabularyCategories(),
                    getVocabularyWords(),
                ]);

                setCategories(
                    [...categoriesData].sort(
                        (a, b) =>
                            a.orderIndex - b.orderIndex
                    )
                );

                setWords(wordsData);
            } catch (error) {
                console.error(error);

                setError(
                    "Não foi possível carregar os dados do vocabulário."
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // =========================
    // CATEGORY CRUD
    // =========================

    function resetCategoryForm() {
        setName("");
        setSlug("");
        setDescription("");
        setIcon("");
        setActive(true);
        setOrderIndex(0);

        setEditingCategoryId(null);
        setShowCategoryForm(false);
    }

    function openNewCategoryForm() {
        resetCategoryForm();
        setShowCategoryForm(true);
    }

    function handleEditCategory(
        category: VocabularyCategory
    ) {
        setEditingCategoryId(category.id);

        setName(category.name);
        setSlug(category.slug);
        setDescription(category.description ?? "");
        setIcon(category.icon ?? "");
        setActive(category.active);
        setOrderIndex(category.orderIndex);

        setShowCategoryForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function handleCategorySubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSavingCategory(true);

        const data = {
            name,
            slug,
            description,
            icon,
            active,
            orderIndex,
        };

        try {
            if (editingCategoryId !== null) {
                const updated =
                    await updateVocabularyCategory(
                        editingCategoryId,
                        data
                    );

                setCategories((current) =>
                    current
                        .map((category) =>
                            category.id ===
                            editingCategoryId
                                ? updated
                                : category
                        )
                        .sort(
                            (a, b) =>
                                a.orderIndex -
                                b.orderIndex
                        )
                );
            } else {
                const created =
                    await createVocabularyCategory(
                        data
                    );

                setCategories((current) =>
                    [...current, created].sort(
                        (a, b) =>
                            a.orderIndex -
                            b.orderIndex
                    )
                );
            }

            resetCategoryForm();
        } catch (error) {
            console.error(error);

            setError(
                editingCategoryId !== null
                    ? "Não foi possível atualizar a categoria."
                    : "Não foi possível criar a categoria."
            );
        } finally {
            setSavingCategory(false);
        }
    }

    async function handleDeleteCategory(
        category: VocabularyCategory
    ) {
        const confirmed = window.confirm(
            `Deseja realmente excluir a categoria "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteVocabularyCategory(
                category.id
            );

            setCategories((current) =>
                current.filter(
                    (item) =>
                        item.id !== category.id
                )
            );

            if (
                editingCategoryId === category.id
            ) {
                resetCategoryForm();
            }
        } catch (error) {
            console.error(error);

            setError(
                "Não foi possível excluir a categoria. Verifique se existem palavras vinculadas a ela."
            );
        }
    }

    // =========================
    // WORD CRUD
    // =========================

    function resetWordForm() {
        setEnglish("");
        setPortuguese("");
        setPronunciation("");
        setAudioUrl("");
        setImageUrl("");
        setExampleEnglish("");
        setExamplePortuguese("");
        setObservation("");
        setLevel("");
        setWordCategoryId("");

        setEditingWordId(null);
        setShowWordForm(false);
    }

    function openNewWordForm() {
        resetWordForm();
        setShowWordForm(true);
    }

    function handleEditWord(
        word: VocabularyWord
    ) {
        setEditingWordId(word.id);

        setEnglish(word.english);
        setPortuguese(word.portuguese);
        setPronunciation(
            word.pronunciation ?? ""
        );
        setAudioUrl(word.audioUrl ?? "");
        setImageUrl(word.imageUrl ?? "");
        setExampleEnglish(
            word.exampleEnglish ?? ""
        );
        setExamplePortuguese(
            word.examplePortuguese ?? ""
        );
        setObservation(
            word.observation ?? ""
        );
        setLevel(word.level ?? "");
        setWordCategoryId(word.categoryId);

        setShowWordForm(true);
    }

    async function handleWordSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (wordCategoryId === "") {
            setError(
                "Selecione uma categoria para a palavra."
            );
            return;
        }

        setError("");
        setSavingWord(true);

        const data = {
            english,
            portuguese,
            pronunciation,
            audioUrl,
            imageUrl,
            exampleEnglish,
            examplePortuguese,
            observation,
            ...(level ? { level } : {}),
            categoryId: wordCategoryId,
        };

        try {
            if (editingWordId !== null) {
                const updated =
                    await updateVocabularyWord(
                        editingWordId,
                        data
                    );

                setWords((current) =>
                    current.map((word) =>
                        word.id === editingWordId
                            ? updated
                            : word
                    )
                );
            } else {
                const created =
                    await createVocabularyWord(
                        data
                    );

                setWords((current) => [
                    ...current,
                    created,
                ]);
            }

            resetWordForm();
        } catch (error) {
            console.error(error);

            setError(
                editingWordId !== null
                    ? "Não foi possível atualizar a palavra."
                    : "Não foi possível criar a palavra."
            );
        } finally {
            setSavingWord(false);
        }
    }

    async function handleDeleteWord(
        word: VocabularyWord
    ) {
        const confirmed = window.confirm(
            `Deseja realmente excluir "${word.english}"?`
        );

        if (!confirmed) {
            return;
        }

        setError("");

        try {
            await deleteVocabularyWord(word.id);

            setWords((current) =>
                current.filter(
                    (item) => item.id !== word.id
                )
            );

            if (editingWordId === word.id) {
                resetWordForm();
            }
        } catch (error) {
            console.error(error);

            setError(
                "Não foi possível excluir a palavra."
            );
        }
    }

    return (
        <div className="space-y-10">
            <div>
                <Link
                    to="/admin"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Voltar para administração
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                    Vocabulário
                </h1>

                <p className="mt-2 text-slate-600">
                    Gerencie as categorias e palavras
                    disponíveis na plataforma.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* CATEGORY SECTION */}

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Categorias
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Organize as palavras por
                            assunto.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openNewCategoryForm}
                        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Nova categoria
                    </button>
                </div>

                {showCategoryForm && (
                    <form
                        onSubmit={
                            handleCategorySubmit
                        }
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {editingCategoryId !==
                                    null
                                        ? "Editar categoria"
                                        : "Nova categoria"}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editingCategoryId !==
                                    null
                                        ? "Atualize os dados da categoria."
                                        : "Cadastre uma categoria de vocabulário."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    resetCategoryForm
                                }
                                className="text-sm font-medium text-slate-500 hover:text-slate-700"
                            >
                                Cancelar
                            </button>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Nome
                                </label>

                                <input
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target
                                                .value
                                        )
                                    }
                                    maxLength={100}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Slug
                                </label>

                                <input
                                    value={slug}
                                    onChange={(e) =>
                                        setSlug(
                                            e.target
                                                .value
                                        )
                                    }
                                    maxLength={120}
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Descrição
                                </label>

                                <textarea
                                    value={
                                        description
                                    }
                                    onChange={(e) =>
                                        setDescription(
                                            e.target
                                                .value
                                        )
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Ícone
                                </label>

                                <input
                                    value={icon}
                                    onChange={(e) =>
                                        setIcon(
                                            e.target
                                                .value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Ordem
                                </label>

                                <input
                                    type="number"
                                    min={0}
                                    value={orderIndex}
                                    onChange={(e) =>
                                        setOrderIndex(
                                            Number(
                                                e.target
                                                    .value
                                            )
                                        )
                                    }
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                />
                            </div>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) =>
                                        setActive(
                                            e.target
                                                .checked
                                        )
                                    }
                                />
                                Categoria ativa
                            </label>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                disabled={
                                    savingCategory
                                }
                                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
                            >
                                {savingCategory
                                    ? "Salvando..."
                                    : editingCategoryId !==
                                    null
                                        ? "Salvar alterações"
                                        : "Salvar categoria"}
                            </button>
                        </div>
                    </form>
                )}

                {!loading &&
                    categories.length === 0 && (
                        <div className="rounded-xl border bg-white p-6 text-slate-600">
                            Nenhuma categoria
                            cadastrada.
                        </div>
                    )}

                {categories.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr className="text-left text-sm text-slate-600">
                                <th className="px-5 py-4">
                                    Categoria
                                </th>
                                <th className="px-5 py-4">
                                    Slug
                                </th>
                                <th className="px-5 py-4">
                                    Ordem
                                </th>
                                <th className="px-5 py-4">
                                    Status
                                </th>
                                <th className="px-5 py-4">
                                    Ações
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y">
                            {categories.map(
                                (category) => (
                                    <tr
                                        key={
                                            category.id
                                        }
                                    >
                                        <td className="px-5 py-4 font-medium">
                                            {
                                                category.name
                                            }
                                        </td>

                                        <td className="px-5 py-4">
                                            {
                                                category.slug
                                            }
                                        </td>

                                        <td className="px-5 py-4">
                                            {
                                                category.orderIndex
                                            }
                                        </td>

                                        <td className="px-5 py-4">
                                            {category.active
                                                ? "Ativa"
                                                : "Inativa"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() =>
                                                        handleEditCategory(
                                                            category
                                                        )
                                                    }
                                                    className="font-medium text-blue-600"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteCategory(
                                                            category
                                                        )
                                                    }
                                                    className="font-medium text-red-600"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* WORD SECTION */}

            <section className="space-y-6 border-t border-slate-200 pt-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Palavras
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Gerencie as palavras e
                            expressões do vocabulário.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openNewWordForm}
                        disabled={
                            categories.length === 0
                        }
                        className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Nova palavra
                    </button>
                </div>

                {showWordForm && (
                    <form
                        onSubmit={handleWordSubmit}
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {editingWordId !==
                                    null
                                        ? "Editar palavra"
                                        : "Nova palavra"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    resetWordForm
                                }
                                className="text-sm font-medium text-slate-500"
                            >
                                Cancelar
                            </button>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <Input
                                label="Inglês"
                                value={english}
                                setValue={setEnglish}
                                required
                            />

                            <Input
                                label="Português"
                                value={portuguese}
                                setValue={
                                    setPortuguese
                                }
                                required
                            />

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Categoria
                                </label>

                                <select
                                    value={
                                        wordCategoryId
                                    }
                                    onChange={(e) =>
                                        setWordCategoryId(
                                            e.target
                                                .value ===
                                            ""
                                                ? ""
                                                : Number(
                                                    e
                                                        .target
                                                        .value
                                                )
                                        )
                                    }
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                >
                                    <option value="">
                                        Selecione
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Nível
                                </label>

                                <select
                                    value={level}
                                    onChange={(e) =>
                                        setLevel(
                                            e.target
                                                .value as
                                                | VocabularyEnglishLevel
                                                | ""
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                >
                                    <option value="">
                                        Sem nível
                                    </option>
                                    <option value="A1">
                                        A1
                                    </option>
                                    <option value="A2">
                                        A2
                                    </option>
                                    <option value="B1">
                                        B1
                                    </option>
                                    <option value="B2">
                                        B2
                                    </option>
                                    <option value="C1">
                                        C1
                                    </option>
                                    <option value="C2">
                                        C2
                                    </option>
                                </select>
                            </div>

                            <Input
                                label="Pronúncia"
                                value={pronunciation}
                                setValue={
                                    setPronunciation
                                }
                            />

                            <Input
                                label="URL do áudio"
                                value={audioUrl}
                                setValue={setAudioUrl}
                            />

                            <Input
                                label="URL da imagem"
                                value={imageUrl}
                                setValue={setImageUrl}
                            />

                            <Input
                                label="Exemplo em inglês"
                                value={
                                    exampleEnglish
                                }
                                setValue={
                                    setExampleEnglish
                                }
                            />

                            <Input
                                label="Exemplo em português"
                                value={
                                    examplePortuguese
                                }
                                setValue={
                                    setExamplePortuguese
                                }
                            />

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Observação
                                </label>

                                <textarea
                                    value={
                                        observation
                                    }
                                    onChange={(e) =>
                                        setObservation(
                                            e.target
                                                .value
                                        )
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                disabled={savingWord}
                                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
                            >
                                {savingWord
                                    ? "Salvando..."
                                    : editingWordId !==
                                    null
                                        ? "Salvar alterações"
                                        : "Salvar palavra"}
                            </button>
                        </div>
                    </form>
                )}

                {!loading &&
                    words.length === 0 && (
                        <div className="rounded-xl border bg-white p-6 text-slate-600">
                            Nenhuma palavra cadastrada.
                        </div>
                    )}

                {words.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                            <tr className="text-left text-sm text-slate-600">
                                <th className="px-5 py-4">
                                    Inglês
                                </th>
                                <th className="px-5 py-4">
                                    Português
                                </th>
                                <th className="px-5 py-4">
                                    Categoria
                                </th>
                                <th className="px-5 py-4">
                                    Nível
                                </th>
                                <th className="px-5 py-4">
                                    Ações
                                </th>
                            </tr>
                            </thead>

                            <tbody className="divide-y">
                            {words.map((word) => (
                                <tr key={word.id}>
                                    <td className="px-5 py-4 font-semibold text-slate-900">
                                        {
                                            word.english
                                        }
                                    </td>

                                    <td className="px-5 py-4">
                                        {
                                            word.portuguese
                                        }
                                    </td>

                                    <td className="px-5 py-4">
                                        {
                                            word.categoryName
                                        }
                                    </td>

                                    <td className="px-5 py-4">
                                        {word.level ??
                                            "—"}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() =>
                                                    handleEditWord(
                                                        word
                                                    )
                                                }
                                                className="font-medium text-blue-600"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDeleteWord(
                                                        word
                                                    )
                                                }
                                                className="font-medium text-red-600"
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
            </section>
        </div>
    );
}

interface InputProps {
    label: string;
    value: string;
    setValue: (value: string) => void;
    required?: boolean;
}

function Input({
                   label,
                   value,
                   setValue,
                   required = false,
               }: InputProps) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                value={value}
                onChange={(e) =>
                    setValue(e.target.value)
                }
                required={required}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
        </div>
    );
}