import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "./ui";

export function NewTemplateModal(props: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!props.open) {
      setName("");
      setDescription("");
      setError(null);
      setSaving(false);
    }
  }, [props.open]);

  if (!props.open) return null;

  async function submit() {
    setError(null);

    const n = name.trim();
    const d = description.trim();

    if (!n) {
      setError("El nombre es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/v1/templates", {
        name: n,
        description: d ? d : null,
      });

      props.onClose();
      props.onCreated();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear la colección");
    } finally {
      setSaving(false);
    }
  }

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => {
              if (!saving) props.onClose();
            }}
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[15%] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-[10%] bottom-[10%] h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <Card className="rounded-[28px] border border-white/15 bg-white/[0.07] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                Nueva colección
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Crea una nueva colección
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Define una colección para empezar a añadir atributos y registrar datos.
              </p>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Nombre
                </label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Coches"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-black/25"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Descripción
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Colección para registrar coches, características y observaciones"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-black/25"
                />
              </div>

              {error && (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
              <Button variant="ghost" onClick={props.onClose} disabled={saving}>
                Cancelar
              </Button>

              <Button variant="secondary" onClick={submit} disabled={saving}>
                {saving ? "Creando..." : "Crear colección"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
  );
}