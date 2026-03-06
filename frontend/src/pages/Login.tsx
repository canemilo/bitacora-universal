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
      const path = mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const res = await api.post<AuthResponse>(path, { email, password });
      setToken(res.token);
      props.onDone();
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <div className="mb-4">
            <h1 className="text-xl font-bold text-slate-900">Bitácora Universal</h1>
            <p className="text-sm text-slate-600">
              Inicia sesión para ver tus plantillas.
            </p>
          </div>

          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-700">Email</span>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-700">Password</span>
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button onClick={submit}>{loading ? "..." : mode === "login" ? "Login" : "Register"}</Button>
              <button
                className="text-sm text-slate-700 underline"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                type="button"
              >
                {mode === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
