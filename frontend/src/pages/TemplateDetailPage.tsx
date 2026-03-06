import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Button, Card } from "../components/ui";
import NewFieldModal from "../components/NewFieldModal";
import EditRowModal from "../components/EditRowModal";
import NewRowModal from "../components/NewRowModal";
import EditCollectionModal from "../components/EditCollectionModal";

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

function fieldTypeLabel(dataType: string) {
    if (dataType === "TEXT") return "Texto";
    if (dataType === "NUMBER") return "Número";
    if (dataType === "BOOLEAN") return "Sí / No";
    if (dataType === "DATE") return "Fecha";
    if (dataType === "SELECT") return "Lista";
    return dataType;
}

export default function TemplateDetailPage(props: {
    templateId: string;
    onBack: () => void;
    onDeleted: (templateId: string) => void;
}) {
    const [data, setData] = useState<CollectionDetail | null>(null);
    const [rows, setRows] = useState<RowItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newRowOpen, setNewRowOpen] = useState(false);
    const [newFieldOpen, setNewFieldOpen] = useState(false);

    const [editingRow, setEditingRow] = useState<RowItem | null>(null);
    const [editingField, setEditingField] = useState<Field | null>(null);

    const [deletingRow, setDeletingRow] = useState<RowItem | null>(null);
    const [deletingRowLoading, setDeletingRowLoading] = useState(false);

    const [editCollectionOpen, setEditCollectionOpen] = useState(false);
    const [confirmDeleteCollectionOpen, setConfirmDeleteCollectionOpen] =
        useState(false);
    const [deletingCollection, setDeletingCollection] = useState(false);

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

    async function deleteRow() {
        if (!deletingRow) return;

        setDeletingRowLoading(true);
        setError(null);

        try {
            await api.del(`/api/v1/templates/${props.templateId}/rows/${deletingRow.id}`);
            setDeletingRow(null);
            await load();
        } catch (e: any) {
            setError(e?.message ?? "No se pudo borrar el registro");
        } finally {
            setDeletingRowLoading(false);
        }
    }

    async function deleteCollection() {
        setDeletingCollection(true);
        setError(null);

        try {
            await api.del(`/api/v1/templates/${props.templateId}`);
            setConfirmDeleteCollectionOpen(false);
            props.onDeleted(props.templateId);
        } catch (e: any) {
            setError(e?.message ?? "No se pudo borrar la colección");
            setDeletingCollection(false);
            setConfirmDeleteCollectionOpen(false);
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
            <EditCollectionModal
                open={editCollectionOpen}
                templateId={props.templateId}
                initialName={data?.name ?? ""}
                initialDescription={data?.description ?? null}
                onClose={() => setEditCollectionOpen(false)}
                onSaved={() => {
                    setEditCollectionOpen(false);
                    load();
                }}
            />

            <NewFieldModal
                open={newFieldOpen}
                templateId={props.templateId}
                nextOrderIndex={nextOrderIndex}
                mode={editingField ? "edit" : "create"}
                fieldToEdit={editingField}
                onClose={() => {
                    setNewFieldOpen(false);
                    setEditingField(null);
                }}
                onCreated={() => {
                    setNewFieldOpen(false);
                    setEditingField(null);
                    load();
                }}
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

            {deletingRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={() => {
                            if (!deletingRowLoading) setDeletingRow(null);
                        }}
                    />

                    <div className="relative z-10 w-full max-w-md">
                        <Card className="rounded-[32px] border border-white/15 bg-white/[0.08] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                            <div className="border-b border-white/10 px-6 py-5">
                                <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                                    Confirmar borrado
                                </div>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                    Borrar registro
                                </h2>
                            </div>

                            <div className="px-6 py-6 text-sm text-white/70">
                                Este registro se eliminará de forma permanente.
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
                                <Button
                                    variant="ghost"
                                    onClick={() => setDeletingRow(null)}
                                    disabled={deletingRowLoading}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant="secondary"
                                    onClick={deleteRow}
                                    disabled={deletingRowLoading}
                                >
                                    {deletingRowLoading ? "Borrando..." : "Borrar"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {confirmDeleteCollectionOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={() => {
                            if (!deletingCollection) setConfirmDeleteCollectionOpen(false);
                        }}
                    />

                    <div className="relative z-10 w-full max-w-md">
                        <Card className="rounded-[32px] border border-white/15 bg-white/[0.08] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                            <div className="border-b border-white/10 px-6 py-5">
                                <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                                    Confirmar borrado
                                </div>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                                    Borrar colección
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-white/55">
                                    Esta colección, sus atributos y sus registros se eliminarán de
                                    forma permanente.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
                                <Button
                                    variant="ghost"
                                    onClick={() => setConfirmDeleteCollectionOpen(false)}
                                    disabled={deletingCollection}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant="secondary"
                                    onClick={deleteCollection}
                                    disabled={deletingCollection}
                                >
                                    {deletingCollection ? "Borrando..." : "Borrar colección"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-7xl px-4 py-8">
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

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setEditCollectionOpen(true)}
                        >
                            Editar colección
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={() => setConfirmDeleteCollectionOpen(true)}
                        >
                            Borrar colección
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => {
                                setEditingField(null);
                                setNewFieldOpen(true);
                            }}
                        >
                            + Añadir atributo
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => setNewRowOpen(true)}
                        >
                            + Nuevo registro
                        </Button>
                    </div>
                </div>

                {sortedFields.length > 0 && (
                    <Card className="mb-6 rounded-[28px] p-4">
                        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
                            Atributos de la colección
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {sortedFields.map((field) => (
                                <div
                                    key={field.id}
                                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2"
                                >
                                    <div>
                                        <div className="text-sm font-medium text-white/80">
                                            {field.label}
                                        </div>
                                        <div className="text-xs text-white/40">
                                            {fieldTypeLabel(field.dataType)}
                                            {" · "}
                                            {field.required ? "Obligatorio" : "Opcional"}
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setEditingField(field);
                                            setNewFieldOpen(true);
                                        }}
                                    >
                                        Editar atributo
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-sm text-white/60">Cargando colección...</div>
                ) : (
                    <Card className="overflow-hidden rounded-[28px] p-0">
                        {sortedFields.length === 0 ? (
                            <div className="p-8">
                                <div className="text-lg font-medium">
                                    La colección todavía no tiene atributos
                                </div>
                                <p className="mt-2 text-sm text-white/55">
                                    Primero añade atributos para definir la estructura de esta
                                    colección.
                                </p>
                                <div className="mt-5">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setEditingField(null);
                                            setNewFieldOpen(true);
                                        }}
                                    >
                                        + Añadir primer atributo
                                    </Button>
                                </div>
                            </div>
                        ) : (
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
                                                    {fieldTypeLabel(field.dataType)}
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
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setEditingRow(row)}
                                                        >
                                                            Editar
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => setDeletingRow(row)}
                                                        >
                                                            Borrar
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}