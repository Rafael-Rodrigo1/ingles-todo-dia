export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    enabled: boolean;
    emailVerified: boolean;
    profileImage: string | null;
    lastLogin: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserEnabledRequest {
    enabled: boolean;
}

export interface UpdateUserRoleRequest {
    role: UserRole;
}