import {
    createContext,
    useState,
    type ReactNode,
} from "react";

import { login as loginService } from "../services/authService";

import type {
    AuthUser,
    LoginRequest,
} from "../types/auth";

interface AuthContextData {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser) as AuthUser;
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem("token")
    );

    async function login(credentials: LoginRequest) {
        const response = await loginService(credentials);

        const authenticatedUser: AuthUser = {
            id: response.id,
            name: response.name,
            email: response.email,
            role: response.role,
        };

        localStorage.setItem("token", response.token);
        localStorage.setItem(
            "user",
            JSON.stringify(authenticatedUser)
        );

        setToken(response.token);
        setUser(authenticatedUser);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    }

    const isAuthenticated = Boolean(token && user);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}