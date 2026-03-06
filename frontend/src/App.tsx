import { useEffect, useMemo, useRef, useState } from "react";
import { api, clearToken, getToken } from "./lib/api";
import { LoginPage } from "./pages/Login";
import { Button, Card } from "./components/ui";
import { NewTemplateModal } from "./components/NewTemplateModal";
import type { TemplateResponse } from "./lib/types";
import TemplateDetailPage from "./pages/TemplateDetailPage";

const PAGE_SIZE = 5;

function TemplateSkeleton() {
    return (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
            <div className="h-5 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="mt-3 h-4 w-56 animate-pulse rounded-full bg-white/10" />
            <div className="mt-6 h-3 w-full animate-pulse rounded-full bg-white/10" />
            <div className="mt-2 h-3 w-3/5 animate-pulse rounded-full bg-white/10" />
            <div className="mt-6 h-10 w-24 animate-pulse rounded-2xl bg-white/10" />
        </div>
    );
}

function StatCard(props: { label: string; value: string | number }) {
    return (
        <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                {props.label}
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {props.value}
            </div>
        </div>
    );
}

function UserMenu(props: { onLogout: () => void }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        function handleEsc(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <div className="relative z-[120]" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/[0.06] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:bg-white/[0.10]"
            >
                B
            </button>

            {open && (
                <div className="absolute right-0 top-14 z-[140] w-56 rounded-[24px] border border-white/12 bg-[#0b0c10]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                    <div className="px-3 py-2">
                        <div className="text-sm font-medium text-white"> Bitácora </div>
                        <div className="mt-1 text-xs text-white/45">Sesión iniciada</div>
                    </div>

                    <div className="my-2 h-px bg-white/10" />

                    <button
                        onClick={props.onLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                    >
                        <span className="text-base">↩</span>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default function App() {
    const [token, setTokenState] = useState<string | null>(getToken());
    const [templates, setTemplates] = useState<TemplateResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newOpen, setNewOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    async function load() {
        setError(null);
        setLoading(true);

        try {
            const data = await api.get<TemplateResponse[]>("/api/v1/templates");
            setTemplates(data);
        } catch (e: any) {
            setError(e?.message ?? "No se pudo cargar");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            load();
        }
    }, [token]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return templates;

        return templates.filter((t) => {
            const name = t.name?.toLowerCase() ?? "";
            const desc = t.description?.toLowerCase() ?? "";
            const id = t.id?.toLowerCase() ?? "";
            return name.includes(q) || desc.includes(q) || id.includes(q);
        });
    }, [templates, query]);

    useEffect(() => {
        setPage(1);
    }, [query]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    const paginatedTemplates = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    if (!token) {
        return <LoginPage onDone={() => setTokenState(getToken())} />;
    }

    if (selectedTemplateId) {
        return (
            <TemplateDetailPage
                templateId={selectedTemplateId}
                onBack={() => setSelectedTemplateId(null)}
            />
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
            <NewTemplateModal
                open={newOpen}
                onClose={() => setNewOpen(false)}
                onCreated={load}
            />

            {/* Fondo premium */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-100px] top-[-120px] h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute right-[-120px] top-[80px] h-[320px] w-[320px] rounded-full bg-fuchsia-400/10 blur-3xl" />
                <div className="absolute bottom-[-140px] left-1/3 h-[340px] w-[340px] rounded-full bg-blue-500/10 blur-3xl" />

                <div className="absolute inset-x-0 top-8 select-none text-center">
                    <div className="text-[18vw] font-black uppercase tracking-[0.16em] text-white/[0.03]">
                        BITÁCORA
                    </div>
                </div>
            </div>

            {/* Topbar */}
            <header className="relative z-[110] border-b border-white/10 bg-white/[0.03] backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/[0.07] text-sm font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                            B
                        </div>

                        <div>
                            <div className="text-base font-semibold tracking-wide text-white">
                                Bitácora
                            </div>

                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => setNewOpen(true)}>
                            Crear plantilla
                        </Button>

                        <Button variant="ghost" onClick={load} disabled={loading}>
                            {loading ? "Actualizando..." : "Actualizar"}
                        </Button>

                        <UserMenu
                            onLogout={() => {
                                clearToken();
                                setTokenState(null);
                            }}
                        />
                    </div>
                </div>
            </header>

            <main className="relative z-10 mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-6 xl:grid-cols-[1.6fr_0.65fr]">
                    {/* Columna principal */}
                    <section>
                        <Card className="rounded-[32px] p-8">
                            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                                <div className="max-w-3xl">
                                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                                        Panel principal
                                    </div>

                                    <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                                        Mis plantillas
                                    </h1>

                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
                                        Crea y organiza plantillas dinámicas de forma simple, limpia y visual.
                                        Añade columnas personalizadas y registra filas como si fuera una base
                                        de datos ligera con diseño premium.
                                    </p>
                                </div>

                                <div className="text-sm text-white/45">
                                    {templates.length} totales · {filtered.length} visibles
                                </div>
                            </div>
                        </Card>

                        {error && (
                            <div className="mt-6 rounded-[28px] border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-200 backdrop-blur-xl">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 grid gap-4">
                            {loading ? (
                                <>
                                    <TemplateSkeleton />
                                    <TemplateSkeleton />
                                    <TemplateSkeleton />
                                </>
                            ) : paginatedTemplates.length === 0 ? (
                                <Card className="rounded-[32px] p-8">
                                    <div className="flex flex-col items-start gap-3">
                                        <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/40">
                                            Empty state
                                        </div>

                                        <h2 className="text-2xl font-semibold tracking-tight">
                                            No hay plantillas todavía
                                        </h2>

                                        <p className="max-w-xl text-sm leading-7 text-white/55">
                                            Crea tu primera plantilla y empieza a construir una bitácora con
                                            campos y registros personalizados.
                                        </p>

                                        <div className="pt-2">
                                            <Button variant="secondary" onClick={() => setNewOpen(true)}>
                                                Crear plantilla
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                paginatedTemplates.map((t) => (
                                    <Card
                                        key={t.id}
                                        className="rounded-[26px] p-5 transition duration-200 hover:border-white/20 hover:bg-white/[0.08]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="truncate text-xl font-semibold tracking-tight">
                                                    {t.name}
                                                </div>

                                                <div className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
                                                    {t.description || "Sin descripción"}
                                                </div>
                                            </div>

                                            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/45">
      Template
    </span>
                                        </div>

                                        <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 px-3 py-2 text-[11px] text-white/35">
                                            <div className="truncate">{t.id}</div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                variant="secondary"
                                                onClick={() => setSelectedTemplateId(t.id)}
                                                className="px-4 py-2 text-sm"
                                            >
                                                Abrir
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>

                        {!loading && filtered.length > PAGE_SIZE && (
                            <div className="mt-6 flex items-center justify-between rounded-[28px] border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">
                                <div className="text-sm text-white/45">
                                    Página <span className="text-white">{safePage}</span> de{" "}
                                    <span className="text-white">{totalPages}</span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        disabled={safePage <= 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    >
                                        Anterior
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        disabled={safePage >= totalPages}
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Lateral derecho */}
                    <aside>
                        <div className="space-y-4">
                            <Card className="rounded-[30px] p-6">
                                <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                                    Buscar
                                </div>

                                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                                    Buscar plantillas
                                </h2>

                                <p className="mt-2 text-sm leading-7 text-white/55">
                                    Filtra por nombre, descripción o id para encontrar rápidamente una
                                    plantilla concreta.
                                </p>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Buscar..."
                                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                                    />
                                </div>
                            </Card>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                                <StatCard label="Plantillas" value={templates.length} />
                                <StatCard label="Resultados" value={filtered.length} />
                            </div>

                            <Card className="rounded-[30px] p-6">
                                <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                                    Acciones
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                    <Button variant="secondary" onClick={() => setNewOpen(true)}>
                                        Crear plantilla
                                    </Button>

                                    <Button variant="ghost" onClick={load} disabled={loading}>
                                        {loading ? "Actualizando..." : "Actualizar"}
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}