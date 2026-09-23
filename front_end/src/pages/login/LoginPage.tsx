import { useState, type FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
    const { login, user, isAuthenticated } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login({
                email,
                password,
            });
        } catch (error) {
            console.error(error);
            setError("E-mail ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    if (isAuthenticated && user) {
        return (
            <Navigate
                to={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                replace
            />
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="inline-block text-3xl font-bold text-blue-600"
                    >
                        Inglês Todo Dia
                    </Link>

                    <p className="mt-2 text-slate-600">
                        Continue sua jornada no inglês.
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Entrar
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Entre com sua conta para continuar estudando.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="seuemail@exemplo.com"
                                autoComplete="email"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Senha
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Digite sua senha"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Ainda não possui uma conta?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Criar conta
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}