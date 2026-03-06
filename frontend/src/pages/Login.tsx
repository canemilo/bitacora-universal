// src/pages/Login.tsx
import { useState } from "react";
import { api, setToken } from "../lib/api";
import { Button, Card } from "../components/ui";

type AuthResponse = { token: string };

export function LoginPage(props: { onDone: () => void }) {
  const [email, setEmail] = useState("daniel@test.com");
  const [password, setPassword] = useState("123456");
  const [mode, setMode] = useState<"login" | "register">("register");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setLoading(true);

    try {
      const path =
          mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";

      const res = await api.post<AuthResponse>(path, { email, password });
      setToken(res.token);
      props.onDone();
    } catch (e: any) {
      const msg = e?.message ?? "Error";

      if (
          mode === "register" &&
          (msg.includes("409") || msg.toLowerCase().includes("existe"))
      ) {
        setError("Ese email ya está registrado. Usa Login.");
        setMode("login");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
        {/* Fondo decorativo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-100px] h-[340px] w-[340px] rounded-full bg-cyan-400/12 blur-3xl" />
          <div className="absolute right-[-140px] top-[120px] h-[320px] w-[320px] rounded-full bg-fuchsia-400/10 blur-3xl" />
          <div className="absolute bottom-[-120px] left-1/3 h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-3xl" />

          {/* BITÁCORA gigante de fondo */}
          <div className="absolute inset-x-0 top-12 select-none text-center">
            <div className="text-[20vw] font-black uppercase tracking-[0.22em] text-white/[0.035]">
              BITÁCORA
            </div>
          </div>
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Columna izquierda */}
            <div className="hidden lg:block">
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/55 backdrop-blur-md">
                  Bitácora
                </div>

                <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">
                  Organiza tus datos con una experiencia elegante y flexible.
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
                  Crea plantillas dinámicas, define columnas personalizadas y registra
                  filas como si fuera un Excel privado, pero con una interfaz mucho más
                  moderna.
                </p>

                <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="text-sm font-medium text-white">Plantillas dinámicas</div>
                    <div className="mt-2 text-sm leading-6 text-white/55">
                      Diseña categorías como coches, clientes, inventario o cualquier tipo
                      de bitácora.
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="text-sm font-medium text-white">Columnas flexibles</div>
                    <div className="mt-2 text-sm leading-6 text-white/55">
                      Añade campos nuevos en cualquier momento y adapta la estructura a tus
                      necesidades.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card login */}
            <div className="w-full max-w-md justify-self-center lg:justify-self-end">
              <Card className="rounded-[32px] border border-white/15 bg-white/[0.08] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Acceso
                  </div>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    Bitácora
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Inicia sesión para ver tus plantillas o crea una cuenta nueva.
                  </p>
                </div>

                <div className="mt-8 grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/75">Email</span>
                    <input
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-white/75">Password</span>
                    <input
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                    />
                  </label>

                  {error && (
                      <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    <Button onClick={submit} disabled={loading}>
                      {loading
                          ? "Procesando..."
                          : mode === "login"
                              ? "Entrar"
                              : "Register"}
                    </Button>

                    <button
                        className="text-sm text-white/65 underline underline-offset-4 transition hover:text-white"
                        onClick={() =>
                            setMode(mode === "login" ? "register" : "login")
                        }
                        type="button"
                    >
                      {mode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
}