import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLessons } from "../../services/lessonService";
import type {
    EnglishLevel,
    Lesson,
} from "../../types/lesson";

type LevelFilter = EnglishLevel | "ALL";

const levels: EnglishLevel[] = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
];

function getDifficultyLabel(
    difficulty: Lesson["difficulty"]
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

export function GrammarPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCategory, setSelectedCategory] =
        useState<string>("ALL");

    const [selectedLevel, setSelectedLevel] =
        useState<LevelFilter>("ALL");

    useEffect(() => {
        async function loadLessons() {
            try {
                setLoading(true);
                setError("");

                const data = await getLessons();

                const publishedLessons = data
                    .filter(
                        (lesson) =>
                            lesson.published === true
                    )
                    .sort(
                        (a, b) =>
                            (a.orderIndex ?? 0) -
                            (b.orderIndex ?? 0)
                    );

                setLessons(publishedLessons);
            } catch (error) {
                console.error(
                    "Erro ao carregar lições:",
                    error
                );

                setError(
                    "Não foi possível carregar as aulas."
                );
            } finally {
                setLoading(false);
            }
        }

        loadLessons();
    }, []);

    const categories = useMemo(() => {
        return Array.from(
            new Set(
                lessons.map(
                    (lesson) => lesson.categoryName
                )
            )
        ).sort((a, b) =>
            a.localeCompare(b, "pt-BR")
        );
    }, [lessons]);

    const filteredLessons = useMemo(() => {
        return lessons.filter((lesson) => {
            const matchesCategory =
                selectedCategory === "ALL" ||
                lesson.categoryName ===
                selectedCategory;

            const matchesLevel =
                selectedLevel === "ALL" ||
                lesson.level === selectedLevel;

            return matchesCategory && matchesLevel;
        });
    }, [
        lessons,
        selectedCategory,
        selectedLevel,
    ]);

    return (
        <section className="space-y-8">
            <div>
                <p className="text-sm font-medium text-blue-600">
                    Gramática
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Aulas de inglês
                </h1>

                <p className="mt-2 max-w-2xl text-slate-600">
                    Estude os principais tópicos da
                    gramática inglesa e acompanhe sua
                    evolução.
                </p>
            </div>

            <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Categoria
                    </label>

                    <select
                        value={selectedCategory}
                        onChange={(event) =>
                            setSelectedCategory(
                                event.target.value
                            )
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
                    >
                        <option value="ALL">
                            Todas as categorias
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Nível
                    </label>

                    <select
                        value={selectedLevel}
                        onChange={(event) =>
                            setSelectedLevel(
                                event.target
                                    .value as LevelFilter
                            )
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
                    >
                        <option value="ALL">
                            Todos os níveis
                        </option>

                        {levels.map((level) => (
                            <option
                                key={level}
                                value={level}
                            >
                                {level}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <p className="text-slate-600">
                        Carregando aulas...
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <p className="text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {!loading &&
                !error &&
                lessons.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="font-semibold text-slate-900">
                            Nenhuma aula disponível
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Ainda não existem aulas
                            publicadas.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                lessons.length > 0 &&
                filteredLessons.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="font-semibold text-slate-900">
                            Nenhuma aula encontrada
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Não encontramos aulas para os
                            filtros selecionados.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                filteredLessons.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredLessons.map((lesson) => (
                            <article
                                key={lesson.id}
                                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {lesson.thumbnail && (
                                    <img
                                        src={lesson.thumbnail}
                                        alt=""
                                        className="h-44 w-full object-cover"
                                    />
                                )}

                                <div className="flex flex-1 flex-col p-6">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {lesson.categoryName}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {lesson.level}
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                                        {lesson.title}
                                    </h2>

                                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                                        {lesson.shortDescription ||
                                            lesson.description ||
                                            "Estude esta aula e pratique seus conhecimentos."}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                                        <span>
                                            {getDifficultyLabel(
                                                lesson.difficulty
                                            )}
                                        </span>

                                        <span>
                                            {
                                                lesson.estimatedTime
                                            }{" "}
                                            min
                                        </span>
                                    </div>

                                    <Link
                                        to={`/lesson/${lesson.id}`}
                                        className="mt-5 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                                    >
                                        Estudar aula
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
        </section>
    );
}