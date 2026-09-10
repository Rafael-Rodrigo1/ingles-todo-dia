import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

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
        <div>
            <h1>Entrar</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-mail</label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Senha</label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}