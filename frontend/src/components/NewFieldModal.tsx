import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "./ui";

type FieldType = "TEXT" | "NUMBER" | "BOOLEAN" | "DATE" | "SELECT";

type EditableField = {
  id: string;
  fieldKey: string;
  label: string;
  dataType: string;
  required: boolean;
  optionsJson?: string | null;
  orderIndex: number;
};

function normalizeInternalName(value: string): string {
  return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s_]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
}

export default function NewFieldModal(props: {
  open: boolean;
  templateId: string;
  nextOrderIndex: number;
  onClose: () => void;
  onCreated: () => void;
  mode?: "create" | "edit";
  fieldToEdit?: EditableField | null;
}) {
  const [internalName, setInternalName] = useState("");
  const [visibleName, setVisibleName] = useState("");
  const [dataType, setDataType] = useState<FieldType>("TEXT");
  const [required, setRequired] = useState(false);
  const [optionsText, setOptionsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internalEditedManually, setInternalEditedManually] = useState(false);

  const mode = props.mode ?? "create";
  const isEdit = mode === "edit";

  async function deleteField() {
    if (!isEdit || !props.fieldToEdit) return;

    setError(null);
    setDeleting(true);

    try {
      await api.del(
          `/api/v1/templates/${props.templateId}/fields/${props.fieldToEdit.id}`
      );

      props.onClose();
      props.onCreated();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo borrar el atributo");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!props.open) {
      setInternalName("");
      setVisibleName("");
      setDataType("TEXT");
      setRequired(false);
      setOptionsText("");
      setSaving(false);
      setError(null);
      setInternalEditedManually(false);
    }
  }, [props.open]);

  useEffect(() => {
    if (!props.open) return;

    if (isEdit && props.fieldToEdit) {
      setInternalName(props.fieldToEdit.fieldKey ?? "");
      setVisibleName(props.fieldToEdit.label ?? "");
      setDataType((props.fieldToEdit.dataType as FieldType) ?? "TEXT");
      setRequired(props.fieldToEdit.required ?? false);
      setOptionsText(() => {
        try {
          const parsed = props.fieldToEdit?.optionsJson
              ? JSON.parse(props.fieldToEdit.optionsJson)
              : [];
          return Array.isArray(parsed) ? parsed.join(", ") : "";
        } catch {
          return "";
        }
      });
      setSaving(false);
      setError(null);
      setInternalEditedManually(true);
      return;
    }

    if (!isEdit) {
      setInternalName("");
      setVisibleName("");
      setDataType("TEXT");
      setRequired(false);
      setOptionsText("");
      setSaving(false);
      setError(null);
      setInternalEditedManually(false);
    }
  }, [props.open, isEdit, props.fieldToEdit]);

  useEffect(() => {
    if (!internalEditedManually) {
      setInternalName(normalizeInternalName(visibleName));
    }
  }, [visibleName, internalEditedManually]);

  const parsedOptions = useMemo(() => {
    return optionsText
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
  }, [optionsText]);

  if (!props.open) return null;

  function validateInternalName(value: string): string | null {
    if (!value) {
      return "El nombre interno es obligatorio.";
    }

    if (!/^[a-z0-9_]+$/.test(value)) {
      return "El nombre interno solo puede contener letras minúsculas, números y guiones bajos.";
    }

    return null;
  }

  async function submit() {
    setError(null);

    const cleanInternalName = normalizeInternalName(internalName);
    const cleanVisibleName = visibleName.trim();

    if (!cleanVisibleName) {
      setError("El nombre visible es obligatorio.");
      return;
    }

    const internalNameError = validateInternalName(cleanInternalName);
    if (internalNameError) {
      setError(internalNameError);
      return;
    }

    let optionsJson: string | null = null;

    if (dataType === "SELECT") {
      if (parsedOptions.length === 0) {
        setError("Para un atributo de tipo SELECT debes indicar al menos una opción.");
        return;
      }

      optionsJson = JSON.stringify(parsedOptions);
    }

    setSaving(true);

    try {
      const payload = {
        fieldKey: cleanInternalName,
        label: cleanVisibleName,
        dataType,
        required,
        optionsJson,
        orderIndex:
            isEdit && props.fieldToEdit
                ? props.fieldToEdit.orderIndex
                : props.nextOrderIndex,
      };

      if (isEdit && props.fieldToEdit) {
        await api.patch(
            `/api/v1/templates/${props.templateId}/fields/${props.fieldToEdit.id}`,
            payload
        );
      } else {
        await api.post(`/api/v1/templates/${props.templateId}/fields`, payload);
      }

      props.onClose();
      props.onCreated();
    } catch (e: any) {
      setError(
          e?.message ??
          (isEdit
              ? "No se pudo actualizar el atributo"
              : "No se pudo crear el atributo")
      );
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
                {isEdit ? "Editar atributo" : "Nuevo atributo"}
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {isEdit
                    ? "Modifica el atributo de la colección"
                    : "Añade un nuevo atributo a la colección"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {isEdit
                    ? "Actualiza el nombre, el tipo o las reglas de este atributo."
                    : "Define un nuevo campo para guardar información dentro de esta colección."}
              </p>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Nombre visible
                </label>
                <input
                    value={visibleName}
                    onChange={(e) => setVisibleName(e.target.value)}
                    placeholder="Ej: Caballos CV"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                />
                <p className="mt-2 text-xs text-white/40">
                  Es el nombre que verá el usuario dentro de la colección.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Nombre interno
                </label>
                <input
                    value={internalName}
                    onChange={(e) => {
                      setInternalEditedManually(true);
                      setInternalName(normalizeInternalName(e.target.value));
                    }}
                    placeholder="Ej: caballos_cv"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                />
                <p className="mt-2 text-xs text-white/40">
                  Se usa para identificar el atributo en el sistema. Usa minúsculas,
                  sin espacios y sin tildes.
                </p>
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
                  <option value="TEXT">Texto</option>
                  <option value="NUMBER">Número</option>
                  <option value="BOOLEAN">Sí / No</option>
                  <option value="DATE">Fecha</option>
                  <option value="SELECT">Lista de opciones</option>
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
                        placeholder="Ej: Rojo, Negro, Azul"
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-white/25"
                    />
                    <p className="mt-2 text-xs text-white/40">
                      Escribe las opciones separadas por comas.
                    </p>

                    {parsedOptions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {parsedOptions.map((option) => (
                              <span
                                  key={option}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                              >
                        {option}
                      </span>
                          ))}
                        </div>
                    )}
                  </div>
              )}

              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                    type="checkbox"
                    checked={required}
                    onChange={(e) => setRequired(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-black/20"
                />
                <span className="text-sm text-white/75">Obligatorio</span>
              </label>

              {error && (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-5">
              <div>
                {isEdit && (
                    <Button
                        variant="ghost"
                        onClick={deleteField}
                        disabled={saving || deleting}
                    >
                      {deleting ? "Borrando..." : "Borrar atributo"}
                    </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    onClick={props.onClose}
                    disabled={saving || deleting}
                >
                  Cancelar
                </Button>

                <Button
                    variant="secondary"
                    onClick={submit}
                    disabled={saving || deleting}
                >
                  {saving
                      ? isEdit
                          ? "Guardando..."
                          : "Creando..."
                      : isEdit
                          ? "Guardar cambios"
                          : "Crear atributo"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
  );
}