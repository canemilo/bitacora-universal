import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "../components/ui";
import NewFieldModal from "../components/NewFieldModal";
import EditRowModal from "../components/EditRowModal";
import NewRowModal from "../components/NewRowModal";


type Field = {
  id: string;
  fieldKey: string;
  label: string;
  dataType: string;
  required: boolean;
  optionsJson?: string | null;
  orderIndex: number;
};

type CollectionDetail = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  fields: Field[];
};

type RowItem = {
  id: string;
  displayName: string | null;
  values: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export default function TemplateDetailPage(props: {
  templateId: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<CollectionDetail | null>(null);
  const [rows, setRows] = useState<RowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newRowOpen, setNewRowOpen] = useState(false);

  const [newFieldOpen, setNewFieldOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RowItem | null>(null);

  async function load() {
    setError(null);
    setLoading(true);

    try {
      const collectionRes = await api.get<CollectionDetail>(
          `/api/v1/templates/${props.templateId}`
      );

      const rowsRes = await api.get<RowItem[]>(
          `/api/v1/templates/${props.templateId}/rows`
      );

      setData(collectionRes);
      setRows(rowsRes);
    } catch (e: any) {
      setError(e?.message ?? "No se pudo cargar la colección");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [props.templateId]);

  const sortedFields = useMemo(() => {
    if (!data) return [];
    return [...data.fields].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [data]);

  const nextOrderIndex =
      sortedFields.length > 0
          ? Math.max(...sortedFields.map((f) => f.orderIndex)) + 1
          : 1;

  function renderCellValue(field: Field, row: RowItem) {
    const value = row.values?.[field.fieldKey];

    if (value === null || value === undefined || value === "") {
      return <span className="text-white/30">—</span>;
    }

    if (field.dataType === "BOOLEAN") {
      return value ? "Sí" : "No";
    }

    return String(value);
  }

  return (
      <div className="min-h-screen bg-[#06070a] text-white">
        <NewFieldModal
            open={newFieldOpen}
            templateId={props.templateId}
            nextOrderIndex={nextOrderIndex}
            onClose={() => setNewFieldOpen(false)}
            onCreated={load}
        />

        <EditRowModal
            open={!!editingRow}
            templateId={props.templateId}
            row={editingRow}
            fields={sortedFields}
            onClose={() => setEditingRow(null)}
            onSaved={() => {
              setEditingRow(null);
              load();
            }}
        />
        <NewRowModal
            open={newRowOpen}
            templateId={props.templateId}
            fields={sortedFields}
            onClose={() => setNewRowOpen(false)}
            onCreated={() => {
              setNewRowOpen(false);
              load();
            }}
        />

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <button
                  onClick={props.onBack}
                  className="mb-3 text-sm text-white/50 transition hover:text-white/80"
              >
                ← Volver
              </button>

              <h1 className="text-3xl font-semibold tracking-tight">
                {data?.name ?? "Colección"}
              </h1>

              <p className="mt-2 text-sm text-white/55">
                {data?.description || "Sin descripción"}
              </p>

              {sortedFields.length > 0 && (
                  <div className="mt-4 text-sm text-white/45">
                    {sortedFields.map((f) => f.label).join(" · ")}
                  </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setNewFieldOpen(true)}>
                + Añadir atributo
              </Button>

              <Button variant="secondary" onClick={() => setNewRowOpen(true)}>
                + Nuevo registro
              </Button>
            </div>
          </div>

          {error && (
              <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
          )}

          {loading ? (
              <div className="text-sm text-white/60">Cargando colección...</div>
          ) : (
              <Card className="overflow-hidden rounded-[28px] p-0">
                {/* Caso vacío de atributos */}
                {sortedFields.length === 0 ? (
                    <div className="p-8">
                      <div className="text-lg font-medium">La colección todavía no tiene atributos</div>
                      <p className="mt-2 text-sm text-white/55">
                        Primero añade atributos para definir la estructura de esta colección.
                      </p>
                      <div className="mt-5">
                        <Button variant="secondary" onClick={() => setNewFieldOpen(true)}>
                          + Añadir primer atributo
                        </Button>
                      </div>
                    </div>
                ) : (
                    <>
                      {/* Encabezado tabla */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead className="bg-white/[0.04]">
                          <tr className="border-b border-white/10">
                            <th className="px-4 py-4 text-left text-xs uppercase tracking-[0.18em] text-white/40">
                              #
                            </th>

                            {sortedFields.map((field) => (
                                <th
                                    key={field.id}
                                    className="px-4 py-4 text-left text-xs uppercase tracking-[0.18em] text-white/40"
                                >
                                  <div>{field.label}</div>
                                  <div className="mt-1 text-[10px] normal-case tracking-normal text-white/25">
                                    {field.dataType}
                                  </div>
                                </th>
                            ))}

                            <th className="px-4 py-4 text-left text-xs uppercase tracking-[0.18em] text-white/40">
                              Acciones
                            </th>
                          </tr>
                          </thead>

                          <tbody>
                          {rows.length === 0 ? (
                              <tr>
                                <td
                                    colSpan={sortedFields.length + 2}
                                    className="px-4 py-10 text-center text-sm text-white/50"
                                >
                                  No hay registros todavía.
                                </td>
                              </tr>
                          ) : (
                              rows.map((row, index) => (
                                  <tr
                                      key={row.id}
                                      className="border-b border-white/8 transition hover:bg-white/[0.03]"
                                  >
                                    <td className="px-4 py-4 text-sm text-white/45">
                                      {index + 1}
                                    </td>

                                    {sortedFields.map((field) => (
                                        <td
                                            key={field.id}
                                            className="px-4 py-4 text-sm text-white/80"
                                        >
                                          {renderCellValue(field, row)}
                                        </td>
                                    ))}

                                    <td className="px-4 py-4">
                                      <Button
                                          variant="ghost"
                                          onClick={() => setEditingRow(row)}
                                      >
                                        Editar
                                      </Button>
                                    </td>
                                  </tr>
                              ))
                          )}
                          </tbody>
                        </table>
                      </div>
                    </>
                )}
              </Card>
          )}
        </div>
      </div>
  );
}