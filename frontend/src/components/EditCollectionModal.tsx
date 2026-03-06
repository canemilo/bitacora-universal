import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "./ui";

export default function EditCollectionModal(props: {
  open: boolean;
  templateId: string;
  initialName: string;
  initialDescription: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(props.initialName);
  const [description, setDescription] = useState(props.initialDescription ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.open) {
      setName(props.initialName);
      setDescription(props.initialDescription ?? "");
      setError(null);
      setSaving(false);
    }
  }, [props.open, props.initialName, props.initialDescription]);

  if (!props.open) return null;

  async function submit() {
    setError(null);

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (!cleanName) {
      setError("El nombre de la colección es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      await api.patch(`/api/v1/templates/${props.templateId}`, {
        name: cleanName,
        description: cleanDescription || null,
      });

      props.onClose();
      props.onSaved();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo actualizar la colección");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={() => {
          if (!saving) props.onClose();
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        <Card className="rounded-[32px] border border-white/15 bg-white/[0.08] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/35">
              Editar colección
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Configurar colección
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Modifica el nombre y la descripción de esta colección.
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
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
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
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
