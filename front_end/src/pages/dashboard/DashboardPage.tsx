import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getMyProgress } from "../../services/progressService";
import type { UserProgress } from "../../types/userProgress";
import { Link } from "react-router-dom";

export function DashboardPage() {
    const { user } = useAuth();
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProgress() {
            try {
                const data = await getMyProgress();

                setProgress(data);

                console.log("Progresso recebido:", data);
            } catch (error) {
                console.error("Erro ao carregar progresso:", error);
                setError("Não foi possível carregar seu progresso.");
            } finally {
                setLoading(false);
            }
        }

        loadProgress();
    }, []);

    const completedLessons = progress.filter(
        (item) => item.completed
    ).length;

    const totalLessonsInProgress = progress.length;

    const averageProgress =
        progress.length > 0
            ? progress.reduce(
            (total, item) => total + item.percentage,
            0
        ) / progress.length
            : 0;

    const totalStudyTime = progress.reduce(
        (total, item) => total + item.totalStudyTime,
        0
    );
    function formatStudyTime(totalSeconds: number) {
        const hours = Math.floor(totalSeconds / 3600);

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }

        if (minutes > 0) {
            return `${minutes}min`;
        }

        return `${totalSeconds}s`;
    }

    const formattedStudyTime = formatStudyTime(totalStudyTime);

    const recentProgress = [...progress]
        .filter((item) => item.lastAccess !== null)
        .sort(
            (a, b) =>
                new Date(b.lastAccess!).getTime() -
                new Date(a.lastAccess!).getTime()
        )
        .slice(0, 5);

    const lastLesson =
        recentProgress.length > 0
            ? recentProgress[0]
            : null;

    return (
        <section className="space-y-8">
            {/* Cabeçalho */}
            <div>
                <p className="text-sm font-medium text-slate-500">
                    Dashboard
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    Olá, {user?.name}
                </h1>

                <p className="mt-2 text-slate-600">
                    Continue seus estudos e acompanhe sua evolução no inglês.
                </p>
            </div>

            {/* Indicadores */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Progresso médio
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {Math.round(averageProgress)}%
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Média das aulas iniciadas
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Aulas concluídas
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {completedLessons}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Conteúdos finalizados
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Aulas iniciadas
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {totalLessonsInProgress}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Aulas com progresso registrado
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Tempo de estudo
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {formattedStudyTime}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                        Tempo total registrado
                    </p>
                </div>
            </div>

            {/* Continuar estudando */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Continuar estudando
                        </p>

                        {lastLesson ? (
                            <>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                                    {lastLesson.lessonTitle}
                                </h2>

                                <p className="mt-2 text-sm text-slate-600">
                                    Você concluiu {Math.round(lastLesson.percentage)}%
                                    desta aula.
                                </p>

                                <div className="mt-4 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-slate-900"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(0, lastLesson.percentage)
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                                    Comece seus estudos
                                </h2>

                                <p className="mt-2 text-sm text-slate-600">
                                    Você ainda não iniciou nenhuma aula.
                                </p>
                            </>
                        )}
                    </div>

                    {lastLesson && (
                        <Link
                            to={`/lesson/${lastLesson.lessonId}`}
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            Continuar aula
                        </Link>
                    )}
                </div>
            </div>

            {/* Área reservada para integração */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Atividade recente
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Suas atividades de estudo aparecerão aqui.
                    </p>
                </div>

                <div className="py-6">
                    {loading && (
                        <p className="text-sm text-slate-500">
                            Carregando progresso...
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {!loading && !error && recentProgress.length === 0 && (
                        <p className="text-sm text-slate-500">
                            Nenhuma atividade recente encontrada.
                        </p>
                    )}

                    {!loading && !error && recentProgress.length > 0 && (
                        <div className="space-y-3">
                            {recentProgress.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {item.lessonTitle}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Último acesso:{" "}
                                            {new Date(item.lastAccess!).toLocaleString("pt-BR")}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {Math.round(item.percentage)}%
                                        </p>

                                        <p
                                            className={`mt-1 text-xs font-medium ${
                                                item.completed
                                                    ? "text-green-600"
                                                    : "text-amber-600"
                                            }`}
                                        >
                                            {item.completed
                                                ? "Concluída"
                                                : "Em andamento"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}