"use client";

export interface FiltrosCajaState {
  tipo: "todos" | "ingreso" | "egreso";
  categoria: string;
  desde: string;
  hasta: string;
}

export const FILTROS_VACIOS: FiltrosCajaState = {
  tipo: "todos",
  categoria: "",
  desde: "",
  hasta: "",
};

interface FiltrosCajaProps {
  filtros: FiltrosCajaState;
  onChange: (filtros: FiltrosCajaState) => void;
  categorias: string[];
}

export function FiltrosCaja({
  filtros,
  onChange,
  categorias,
}: FiltrosCajaProps) {
  const hayFiltrosActivos =
    filtros.tipo !== "todos" ||
    filtros.categoria !== "" ||
    filtros.desde !== "" ||
    filtros.hasta !== "";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex gap-2">
        {(
          [
            { valor: "todos", label: "Todos" },
            { valor: "ingreso", label: "Ingresos" },
            { valor: "egreso", label: "Egresos" },
          ] as const
        ).map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            onClick={() => onChange({ ...filtros, tipo: opcion.valor })}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              filtros.tipo === opcion.valor
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <input
          type="date"
          value={filtros.desde}
          onChange={(e) => onChange({ ...filtros, desde: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
        <input
          type="date"
          value={filtros.hasta}
          onChange={(e) => onChange({ ...filtros, hasta: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>

      {categorias.length > 0 && (
        <select
          value={filtros.categoria}
          onChange={(e) => onChange({ ...filtros, categoria: e.target.value })}
          className="mt-2 w-full rounded-lg border border-neutral-300 px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>
      )}

      {hayFiltrosActivos && (
        <button
          type="button"
          onClick={() => onChange(FILTROS_VACIOS)}
          className="mt-2 text-sm font-medium text-neutral-500 underline dark:text-neutral-400"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
