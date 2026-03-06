import { useState } from "react";
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

      setName("");
      setDescription("");
      props.onClose();
      props.onCreated();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear la plantilla");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => (saving ? null : props.onClose())}
      />

      {/* dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Card title="Nueva plantilla">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70">Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Coches usados"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-white/70">Descripción (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Mi excel personal"
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white outline-none focus:border-white/30"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={props.onClose} disabled={saving}>
                  Cancelar
                </Button>
                <Button onClick={submit} disabled={saving}>
                  {saving ? "Creando..." : "Crear"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
