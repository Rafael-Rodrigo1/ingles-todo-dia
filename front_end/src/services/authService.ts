import api from "./api";

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
} from "../types/auth";

export const login = async (
    credentials: LoginRequest
): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
    );

    return response.data;
};

export const register = async (
    data: RegisterRequest
): Promise<void> => {
    await api.post("/auth/register", data);
};