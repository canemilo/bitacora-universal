import { useEffect, useState } from "react";
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

export default function EditRowModal(props: {
  open: boolean;
  templateId: string;
  row: any | null;
  fields: Field[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [values, setValues] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.row) {
      setDisplayName(props.row.displayName ?? "");
      setValues(props.row.values ?? {});
      setError(null);
      setSaving(false);
    }
  }, [props.row]);

  if (!props.open || !props.row) return null;

  function setFieldValue(fieldKey: string, value: any) {
    setValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }

  async function save() {
    setError(null);
    setSaving(true);

    try {
      await api.patch(
        `/api/v1/templates/${props.templateId}/rows/${props.row.id}`,
        {
          displayName,
          values,
        }
      );

      props.onClose();
      props.onSaved();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar");
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

      <div className="relative z-10 w-full max-w-2xl">
        <Card className="rounded-[32px] border border-white/15 bg-white/[0.08] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">
              Editar registro
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Modificar datos de la colección
            </h2>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/75">
                Nombre visible
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
              />
            </div>

            {props.fields
              .slice()
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((field) => (
                <div key={field.id}>
                  <label className="mb-2 block text-sm font-medium text-white/75">
                    {field.label}
                  </label>

                  {field.dataType === "TEXT" && (
                    <input
                      value={values[field.fieldKey] ?? ""}
                      onChange={(e) => setFieldValue(field.fieldKey, e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  )}

                  {field.dataType === "NUMBER" && (
                    <input
                      type="number"
                      value={values[field.fieldKey] ?? ""}
                      onChange={(e) =>
                        setFieldValue(
                          field.fieldKey,
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  )}

                  {field.dataType === "DATE" && (
                    <input
                      type="date"
                      value={values[field.fieldKey] ?? ""}
                      onChange={(e) => setFieldValue(field.fieldKey, e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    />
                  )}

                  {field.dataType === "BOOLEAN" && (
                    <select
                      value={String(values[field.fieldKey] ?? false)}
                      onChange={(e) =>
                        setFieldValue(field.fieldKey, e.target.value === "true")
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  )}

                  {field.dataType === "SELECT" && (
                    <select
                      value={values[field.fieldKey] ?? ""}
                      onChange={(e) => setFieldValue(field.fieldKey, e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="">Seleccionar...</option>
                      {(() => {
                        let options: string[] = [];
                        try {
                          options = field.optionsJson ? JSON.parse(field.optionsJson) : [];
                        } catch {
                          options = [];
                        }

                        return options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ));
                      })()}
                    </select>
                  )}
                </div>
              ))}

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
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
