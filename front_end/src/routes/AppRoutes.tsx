import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/login/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import { LessonPage } from "../pages/lesson/LessonPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { MainLayout } from "../layout/MainLayout";
import { RegisterPage } from "../pages/register/RegisterPage";
import { GrammarPage } from "../pages/grammar/GrammarPage";
import { AdminTagsPage } from "../pages/Admin/tags/AdminTagsPage";
import { AdminDashboardPage } from "../pages/Admin/AdminDashboardPage";
import { AdminCategoriesPage } from "../pages/Admin/categories/AdminCategoriesPage";
import { AdminLessonsPage } from "../pages/Admin/lessons/AdminLessonsPage";
import { AdminUsersPage } from "../pages/Admin/users/AdminUsersPage";
import { AdminExercisesPage } from "../pages/Admin/exercises/AdminExercisesPage";
import AdminLessonSectionsPage from "../pages/Admin/lessons/AdminLessonSectionsPage";
import { AdminVocabularyPage } from "../pages/Admin/vocabulary/AdminVocabularyPage";
import { AdminExerciseQuestionsPage } from "../pages/Admin/exercises/AdminExerciseQuestionsPage";
import { AdminQuestionAlternativesPage } from "../pages/Admin/exercises/AdminQuestionAlternativesPage";

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
                        element={<GrammarPage />}
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
                            path="/admin/categories"
                            element={<AdminCategoriesPage />}
                        />

                        <Route
                            path="/admin/lessons"
                            element={<AdminLessonsPage />}
                        />

                        <Route
                            path="/admin/exercises"
                            element={<AdminExercisesPage />}
                        />

                        <Route
                            path="/admin/vocabulary"
                            element={<AdminVocabularyPage />}
                        />

                        <Route
                            path="/admin/tags"
                            element={<AdminTagsPage />}
                        />

                        <Route
                            path="/admin/users"
                            element={<AdminUsersPage />}
                        />

                        <Route
                            path="/admin/lessons/:lessonId/sections"
                            element={<AdminLessonSectionsPage />}
                        />

                        <Route
                            path="/admin/exercises/:exerciseId/questions"
                            element={<AdminExerciseQuestionsPage />}
                        />

                        <Route
                            path="/admin/questions/:questionId/alternatives"
                            element={<AdminQuestionAlternativesPage />}
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