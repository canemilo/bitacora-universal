import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "../components/ui";
import NewFieldModal from "../components/NewFieldModal";

type Field = {
  id: string;
  fieldKey: string;
  label: string;
  dataType: string;
  required: boolean;
  optionsJson?: string | null;
  orderIndex: number;
};

type TemplateDetail = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  fields: Field[];
};

export default function TemplateDetailPage(props: {
  templateId: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newFieldOpen, setNewFieldOpen] = useState(false);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<TemplateDetail>(`/api/v1/templates/${props.templateId}`);
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo cargar la plantilla");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [props.templateId]);

  const nextOrderIndex =
      data && data.fields.length > 0
          ? Math.max(...data.fields.map((f) => f.orderIndex)) + 1
          : 1;

  return (
      <div className="min-h-screen bg-[#06070a] text-white">
        <NewFieldModal
            open={newFieldOpen}
            templateId={props.templateId}
            nextOrderIndex={nextOrderIndex}
            onClose={() => setNewFieldOpen(false)}
            onCreated={load}
        />

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <button
                  onClick={props.onBack}
                  className="mb-3 text-sm text-white/50 transition hover:text-white/80"
              >
                ← Volver
              </button>

              <h1 className="text-3xl font-semibold tracking-tight">
                {data?.name ?? "Plantilla"}
              </h1>

              <p className="mt-2 text-sm text-white/60">
                {data?.description || "Sin descripción"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setNewFieldOpen(true)}>
                + Añadir campo
              </Button>

              <Button variant="secondary" disabled>
                + Nueva fila
              </Button>
            </div>
          </div>

          {error && (
              <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
          )}

          {loading ? (
              <div className="text-sm text-white/60">Cargando plantilla...</div>
          ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <Card title="Campos definidos">
                  {!data || data.fields.length === 0 ? (
                      <div className="text-sm text-white/55">
                        Esta plantilla todavía no tiene campos.
                      </div>
                  ) : (
                      <div className="space-y-3">
                        {data.fields
                            .slice()
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map((f) => (
                                <div
                                    key={f.id}
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <div className="font-medium">{f.label}</div>
                                      <div className="text-xs text-white/45">
                                        key: {f.fieldKey}
                                      </div>
                                    </div>

                                    <div className="text-right text-xs text-white/55">
                                      <div>{f.dataType}</div>
                                      <div>{f.required ? "Obligatorio" : "Opcional"}</div>
                                    </div>
                                  </div>

                                  {f.optionsJson && (
                                      <div className="mt-2 text-xs text-white/40">
                                        options: {f.optionsJson}
                                      </div>
                                  )}
                                </div>
                            ))}
                      </div>
                  )}
                </Card>

                <Card title="Datos (rows)">
                  <div className="text-sm text-white/55">
                    Aquí mostraremos las filas dinámicas cuando creemos el formulario de rows.
                  </div>
                </Card>
              </div>
          )}
        </div>
      </div>
  );
}