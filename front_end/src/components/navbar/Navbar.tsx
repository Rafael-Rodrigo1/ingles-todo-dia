import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-8">
                    <NavLink
                        to="/dashboard"
                        className="text-xl font-bold text-slate-900"
                    >
                        Inglês Todo Dia
                    </NavLink>

                    <div className="flex items-center gap-2">
                        <NavLink
                            to="/dashboard"
                            className={linkClasses}
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/grammar"
                            className={linkClasses}
                        >
                            Gramática
                        </NavLink>

                        <NavLink
                            to="/vocabulary"
                            className={linkClasses}
                        >
                            Vocabulário
                        </NavLink>

                        <NavLink
                            to="/favorites"
                            className={linkClasses}
                        >
                            Favoritos
                        </NavLink>

                        {user?.role === "ADMIN" && (
                            <NavLink
                                to="/admin"
                                className={linkClasses}
                            >
                                Administração
                            </NavLink>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">
                            {user?.name}
                        </p>

                        <p className="text-xs text-slate-500">
                            {user?.role}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Sair
                    </button>
                </div>
            </nav>
        </header>
    );
}