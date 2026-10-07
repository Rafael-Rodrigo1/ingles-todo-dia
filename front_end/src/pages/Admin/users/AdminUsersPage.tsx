import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type {
    AdminUser,
    UserRole,
} from "../../../types/userAdmin";

import {
    getAdminUsers,
    updateAdminUserEnabled,
    updateAdminUserRole,
} from "../../../services/adminUserService";

export function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAdminUsers();

            setUsers(data);
        } catch (error) {
            console.error(error);
            setError("Não foi possível carregar os usuários.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnabledChange = async (
        user: AdminUser
    ) => {
        try {
            setUpdatingId(user.id);
            setError(null);

            const updatedUser = await updateAdminUserEnabled(
                user.id,
                {
                    enabled: !user.enabled,
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser.id === updatedUser.id
                        ? updatedUser
                        : currentUser
                )
            );
        } catch (error) {
            console.error(error);
            setError(
                "Não foi possível alterar o status do usuário."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRoleChange = async (
        user: AdminUser,
        role: UserRole
    ) => {
        if (role === user.role) {
            return;
        }

        try {
            setUpdatingId(user.id);
            setError(null);

            const updatedUser = await updateAdminUserRole(
                user.id,
                {
                    role,
                }
            );

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser.id === updatedUser.id
                        ? updatedUser
                        : currentUser
                )
            );
        } catch (error) {
            console.error(error);
            setError(
                "Não foi possível alterar o perfil de acesso."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) {
            return "Nunca";
        }

        return new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date(date));
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Usuários
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Gerencie contas, permissões e status dos usuários.
                    </p>
                </div>

                <Link
                    to="/admin"
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    Voltar para Administração
                </Link>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Carregando usuários...
                </div>
            ) : users.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                    Nenhum usuário encontrado.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                                Usuário
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                                Perfil
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                                Status
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                                E-mail
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                                Último acesso
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-600">
                                Ações
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                        {users.map((user) => {
                            const isUpdating =
                                updatingId === user.id;

                            return (
                                <tr
                                    key={user.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-slate-900">
                                            {user.name}
                                        </div>

                                        <div className="text-sm text-slate-500">
                                            {user.email}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <select
                                            value={user.role}
                                            disabled={isUpdating}
                                            onChange={(event) =>
                                                handleRoleChange(
                                                    user,
                                                    event.target
                                                        .value as UserRole
                                                )
                                            }
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                                        >
                                            <option value="USER">
                                                USER
                                            </option>

                                            <option value="ADMIN">
                                                ADMIN
                                            </option>
                                        </select>
                                    </td>

                                    <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    user.enabled
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {user.enabled
                                                    ? "Ativo"
                                                    : "Desativado"}
                                            </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {user.emailVerified
                                            ? "Verificado"
                                            : "Não verificado"}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {formatDate(user.lastLogin)}
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            disabled={isUpdating}
                                            onClick={() =>
                                                handleEnabledChange(
                                                    user
                                                )
                                            }
                                            className={`rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
                                                user.enabled
                                                    ? "bg-red-50 text-red-700 hover:bg-red-100"
                                                    : "bg-green-50 text-green-700 hover:bg-green-100"
                                            }`}
                                        >
                                            {isUpdating
                                                ? "Salvando..."
                                                : user.enabled
                                                    ? "Desativar"
                                                    : "Ativar"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}