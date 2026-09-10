import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";

export function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}