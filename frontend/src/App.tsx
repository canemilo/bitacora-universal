import { useEffect, useState } from "react";
import { api, clearToken, getToken } from "./lib/api";
import { LoginPage } from "./pages/Login";
import { Button, Card } from "./components/ui";
import { NewTemplateModal } from "./components/NewTemplateModal";

type Template = {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
};

export default function App() {
    const [token, setTokenState] = useState<string | null>(getToken());
    const [templates, setTemplates] = useState<Template[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [newOpen, setNewOpen] = useState(false);

    async function load() {
        setError(null);
        setLoading(true);
        try {
            const data = await api.get<Template[]>("/api/v1/templates");
            setTemplates(data);
        } catch (e: any) {
            setError(e?.message ?? "Error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) load();
    }, [token]);

    if (!token) return <LoginPage onDone={() => setTokenState(getToken())} />;

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-white">
            <NewTemplateModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={load} />

            <div className="mx-auto max-w-5xl px-4 py-10">
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mis plantillas</h1>
                        <p className="text-sm text-white/60">
                            Cada plantilla es una “tabla” personal con columnas dinámicas.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" onClick={() => setNewOpen(true)}>
                            + Nueva
                        </Button>
                        <Button variant="secondary" onClick={load} disabled={loading}>
                            {loading ? "Cargando..." : "Recargar"}
                        </Button>
                        <Button
                            onClick={() => {
                                clearToken();
                                setTokenState(null);
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </header>

                {error && (
                    <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {templates.map((t) => (
                        <Card key={t.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-lg font-semibold">{t.name}</div>
                                    <div className="mt-1 text-sm text-white/60">
                                        {t.description || "Sin descripción"}
                                    </div>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                  Template
                </span>
                            </div>

                            <div className="mt-4 break-all text-xs text-white/40">{t.id}</div>

                            <div className="mt-5 flex gap-2">
                                <Button variant="secondary" disabled>
                                    Abrir (siguiente paso)
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {templates.length === 0 && !loading && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white/70">
                            No hay plantillas todavía. Crea una con el botón <b>+ Nueva</b>.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}