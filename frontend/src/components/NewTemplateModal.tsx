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
        <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => (saving ? null : props.onClose())}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <Card className="p-8">
              <div className="mb-6">
                <div className="text-xs uppercase tracking-[0.22em] text-white/45">
                  Nueva plantilla
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Crea una nueva bitácora
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Define una categoría personalizada. Después podrás añadir campos dinámicos
                  y registrar filas con tus propios datos.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-white/75">Nombre</label>
                  <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Coches usados"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/75">
                    Descripción (opcional)
                  </label>
                  <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ej: Mi excel personal para registrar coches"
                      rows={4}
                      className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                  />
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={props.onClose} disabled={saving}>
                    Cancelar
                  </Button>
                  <Button onClick={submit} disabled={saving}>
                    {saving ? "Creando..." : "Crear plantilla"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}