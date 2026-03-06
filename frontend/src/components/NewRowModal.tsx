import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "./ui";

type Field = {
  id: string;
  fieldKey: string;
  label: string;
  dataType: string;
  required: boolean;
  optionsJson?: string | null;
  orderIndex: number;
};

export default function NewRowModal(props: {
  open: boolean;
  templateId: string;
  fields: Field[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedFields = useMemo(() => {
    return [...props.fields].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [props.fields]);

  useEffect(() => {
    if (!props.open) {
      setDisplayName("");
      setValues({});
      setSaving(false);
      setError(null);
    }
  }, [props.open]);

  if (!props.open) return null;

  function setFieldValue(fieldKey: string, value: any) {
    setValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }

  function validateRequiredFields(): string | null {
    for (const field of sortedFields) {
      if (!field.required) continue;

      const value = values[field.fieldKey];

      if (value === undefined || value === null || value === "") {
        return `El atributo "${field.label}" es obligatorio.`;
      }
    }

    return null;
  }

  async function save() {
    setError(null);

    const requiredError = validateRequiredFields();
    if (requiredError) {
      setError(requiredError);
      return;
    }

    setSaving(true);

    try {
      await api.post(`/api/v1/templates/${props.templateId}/rows`, {
        displayName: displayName.trim() || null,
        values,
      });

      props.onClose();
      props.onCreated();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo crear el registro");
    } finally {
      setSaving(false);
    }
  }

  function renderFieldInput(field: Field) {
    const value = values[field.fieldKey];

    if (field.dataType === "TEXT") {
      return (
          <input
              value={value ?? ""}
              onChange={(e) => setFieldValue(field.fieldKey, e.target.value)}
              placeholder={`Introduce ${field.label.toLowerCase()}`}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
      );
    }

    if (field.dataType === "NUMBER") {
      return (
          <input
              type="number"
              value={value ?? ""}
              onChange={(e) =>
                  setFieldValue(
                      field.fieldKey,
                      e.target.value === "" ? "" : Number(e.target.value)
                  )
              }
              placeholder={`Introduce ${field.label.toLowerCase()}`}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
          />
      );
    }

    if (field.dataType === "DATE") {
      return (
          <input
              type="date"
              value={value ?? ""}
              onChange={(e) => setFieldValue(field.fieldKey, e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          />
      );
    }

    if (field.dataType === "BOOLEAN") {
      return (
          <select
              value={String(value ?? "")}
              onChange={(e) => {
                if (e.target.value === "") {
                  setFieldValue(field.fieldKey, "");
                } else {
                  setFieldValue(field.fieldKey, e.target.value === "true");
                }
              }}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">Seleccionar...</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
      );
    }

    if (field.dataType === "SELECT") {
      let options: string[] = [];

      try {
        options = field.optionsJson ? JSON.parse(field.optionsJson) : [];
      } catch {
        options = [];
      }

      return (
          <select
              value={value ?? ""}
              onChange={(e) => setFieldValue(field.fieldKey, e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">Seleccionar...</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
            ))}
          </select>
      );
    }

    return null;
  }

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => {
              if (!saving) props.onClose();
            }}
        />

        <div className="relative z-10 w-full max-w-2xl">
          <Card className="rounded-[32px] border border-white/15 bg-white/[0.08] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                Nuevo registro
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Añade un nuevo registro a la colección
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Completa los datos que quieres guardar en esta colección.
              </p>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Nombre visible
                </label>
                <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej: CBR 600"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
                <p className="mt-2 text-xs text-white/40">
                  Este nombre te ayudará a identificar rápidamente el registro.
                </p>
              </div>

              <div className="space-y-5">
                {sortedFields.map((field) => (
                    <div
                        key={field.id}
                        className="rounded-2xl border border-white/10 bg-black/10 p-4"
                    >
                      <label className="mb-2 block text-sm font-medium text-white/75">
                        {field.label}
                        {field.required && (
                            <span className="ml-2 text-xs text-red-300">*</span>
                        )}
                      </label>

                      {renderFieldInput(field)}

                      <div className="mt-2 text-xs text-white/35">
                        {field.dataType === "TEXT" && "Texto libre"}
                        {field.dataType === "NUMBER" && "Valor numérico"}
                        {field.dataType === "DATE" && "Fecha"}
                        {field.dataType === "BOOLEAN" && "Sí o no"}
                        {field.dataType === "SELECT" && "Selecciona una opción"}
                      </div>
                    </div>
                ))}
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

              <Button variant="secondary" onClick={save} disabled={saving}>
                {saving ? "Guardando..." : "Crear registro"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
  );
}