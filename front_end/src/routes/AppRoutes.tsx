import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/login/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import { LessonPage } from "../pages/lesson/LessonPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { MainLayout } from "../layout/MainLayout";
import { RegisterPage } from "../pages/register/RegisterPage";
import { AdminDashboardPage } from "../pages/Admin/AdminDashboardPage";
import { AdminCategoriesPage } from "../pages/Admin/categories/AdminCategoriesPage";
import { AdminLessonsPage } from "../pages/Admin/lessons/AdminLessonsPage";

export function AppRoutes() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

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
                            element={<AdminDashboardPage />}
                        />
                        <Route
                            path="/admin"
                            element={<AdminDashboardPage />}
                        />

                        <Route
                            path="/admin/categories"
                            element={<AdminCategoriesPage />}
                        />

                        <Route
                            path="/admin/lessons"
                            element={<AdminLessonsPage />}
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