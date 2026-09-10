import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/login/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import { LessonPage } from "../pages/lesson/LessonPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { MainLayout } from "../layout/MainLayout";

export function AppRoutes() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas autenticadas */}
            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/grammar"
                        element={<h1>Gramática</h1>}
                    />

                    <Route
                        path="/vocabulary"
                        element={<h1>Vocabulário</h1>}
                    />

                    <Route
                        path="/favorites"
                        element={<h1>Favoritos protegidos</h1>}
                    />

                    <Route
                        path="/lesson/:id"
                        element={<LessonPage />}
                    />

                    {/* Rotas exclusivas para ADMIN */}
                    <Route element={<AdminRoute />}>
                        <Route
                            path="/admin"
                            element={<h1>Painel administrativo</h1>}
                        />
                    </Route>
                </Route>
            </Route>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}