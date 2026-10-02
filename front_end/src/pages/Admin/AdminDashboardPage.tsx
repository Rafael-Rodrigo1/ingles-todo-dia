import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const adminSections = [
    {
        title: "Categorias",
        description: "Organize as categorias utilizadas nas lições.",
        path: "/admin/categories",
    },
    {
        title: "Lições",
        description: "Crie, edite e publique conteúdos de inglês.",
        path: "/admin/lessons",
    },
    {
        title: "Exercícios",
        description: "Gerencie exercícios, questões e alternativas.",
        path: "/admin/exercises",
    },
    {
        title: "Vocabulário",
        description: "Gerencie categorias e palavras do vocabulário.",
        path: "/admin/vocabulary",
    },
    {
        title: "Tags",
        description: "Organize as tags utilizadas nos conteúdos.",
        path: "/admin/tags",
    },
    {
        title: "Usuários",
        description: "Consulte os usuários cadastrados na plataforma.",
        path: "/admin/users",
    },
];

export function AdminDashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <section>
                <p className="text-sm font-medium text-blue-600">
                    Administração
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Painel administrativo
                </h1>

                <p className="mt-2 text-slate-600">
                    Olá, {user?.name}. Gerencie os conteúdos da plataforma.
                </p>
            </section>

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {adminSections.map((section) => (
                    <Link
                        key={section.path}
                        to={section.path}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                    >
                        <h2 className="text-lg font-semibold text-slate-900">
                            {section.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {section.description}
                        </p>

                        <p className="mt-5 text-sm font-semibold text-blue-600">
                            Gerenciar →
                        </p>
                    </Link>
                ))}
            </section>
        </div>
    );
}