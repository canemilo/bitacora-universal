import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "./ui";

type FieldType = "TEXT" | "NUMBER" | "BOOLEAN" | "DATE" | "SELECT";

export default function NewFieldModal(props: {
  open: boolean;
  templateId: string;
  nextOrderIndex: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [fieldKey, setFieldKey] = useState("");
  const [label, setLabel] = useState("");
  const [dataType, setDataType] = useState<FieldType>("TEXT");
  const [required, setRequired] = useState(false);
  const [optionsText, setOptionsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!props.open) {
      setFieldKey("");
      setLabel("");
      setDataType("TEXT");
      setRequired(false);
      setOptionsText("");
      setSaving(false);
      setError(null);
    }
  }, [props.open]);

  if (!props.open) return null;

  async function submit() {
    setError(null);

    const cleanFieldKey = fieldKey.trim();
    const cleanLabel = label.trim();

    if (!cleanFieldKey) {
      setError("fieldKey es obligatorio.");
      return;
    }

    if (!cleanLabel) {
      setError("label es obligatorio.");
      return;
    }

    let optionsJson: string | null = null;

    if (dataType === "SELECT") {
      const options = optionsText
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      if (options.length === 0) {
        setError("Para SELECT debes indicar al menos una opción.");
        return;
      }

      optionsJson = JSON.stringify(options);
    }

    setSaving(true);
    try {
      await api.post(`/api/v1/templates/${props.templateId}/fields`, {
        fieldKey: cleanFieldKey,
        label: cleanLabel,
        dataType,
        required,
        optionsJson,
        orderIndex: props.nextOrderIndex,
      });

      props.onClose();
      props.onCreated();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear el campo");
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
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">
              Nuevo campo
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Añadir columna a la plantilla
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Define un nuevo campo dinámico para esta bitácora.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                fieldKey
              </label>
              <input
                value={fieldKey}
                onChange={(e) => setFieldKey(e.target.value)}
                placeholder="Ej: marca"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
              />
              <p className="mt-2 text-xs text-white/40">
                Clave interna única. Mejor sin espacios ni tildes.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Label
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ej: Marca"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Tipo de dato
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as FieldType)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl focus:border-white/25"
              >
                <option value="TEXT">TEXT</option>
                <option value="NUMBER">NUMBER</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="DATE">DATE</option>
                <option value="SELECT">SELECT</option>
              </select>
            </div>

            {dataType === "SELECT" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Opciones
                </label>
                <input
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  placeholder="Ej: Gasolina, Diesel, Híbrido, Eléctrico"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                />
                <p className="mt-2 text-xs text-white/40">
                  Escribe las opciones separadas por comas.
                </p>
              </div>
            )}

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-black/20"
              />
              <span className="text-sm text-white/75">Campo obligatorio</span>
            </label>

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
              {saving ? "Creando..." : "Crear campo"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
