import api from "./api";

import type {
    AdminUser,
    UpdateUserEnabledRequest,
    UpdateUserRoleRequest,
} from "../types/userAdmin";

export const getAdminUsers = async (): Promise<AdminUser[]> => {
    const response = await api.get<AdminUser[]>("/admin/users");

    return response.data;
};

export const getAdminUserById = async (
    id: number
): Promise<AdminUser> => {
    const response = await api.get<AdminUser>(
        `/admin/users/${id}`
    );

    return response.data;
};

export const updateAdminUserEnabled = async (
    id: number,
    data: UpdateUserEnabledRequest
): Promise<AdminUser> => {
    const response = await api.patch<AdminUser>(
        `/admin/users/${id}/enabled`,
        data
    );

    return response.data;
};

export const updateAdminUserRole = async (
    id: number,
    data: UpdateUserRoleRequest
): Promise<AdminUser> => {
    const response = await api.patch<AdminUser>(
        `/admin/users/${id}/role`,
        data
    );

    return response.data;
};