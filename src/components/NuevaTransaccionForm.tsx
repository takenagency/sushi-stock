"use client";

import { useState } from "react";
import { CategoriaInput } from "@/components/CategoriaInput";
import { fechaHoy } from "@/lib/formato";
import type { Transaccion, TipoTransaccion } from "@/lib/types";

interface NuevaTransaccionFormProps {
  abierto: boolean;
  categorias: string[];
  onCerrar: () => void;
  onCrear: (
    datos: Pick<Transaccion, "tipo" | "nombre" | "monto" | "categoria" | "fecha">
  ) => Promise<{ message: string } | null>;
}

export function NuevaTransaccionForm({
  abierto,
  categorias,
  onCerrar,
  onCrear,
}: NuevaTransaccionFormProps) {
  const [tipo, setTipo] = useState<TipoTransaccion>("egreso");
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState(fechaHoy());
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!abierto) return null;

  function limpiar() {
    setTipo("egreso");
    setNombre("");
    setMonto("");
    setCategoria("");
    setFecha(fechaHoy());
    setError(null);
  }

  async function guardar() {
    const nombreLimpio = nombre.trim();
    const montoNumero = parseFloat(monto.replace(",", "."));

    if (!nombreLimpio) {
      setError("Ponele un nombre a la transacción.");
      return;
    }
    if (Number.isNaN(montoNumero) || montoNumero <= 0) {
      setError("El monto tiene que ser mayor a 0.");
      return;
    }

    setGuardando(true);
    setError(null);

    const resultado = await onCrear({
      tipo,
      nombre: nombreLimpio,
      monto: montoNumero,
      categoria: categoria.trim() || null,
      fecha,
    });

    setGuardando(false);

    if (resultado) {
      setError("No se pudo guardar. Probá de nuevo.");
      return;
    }

    limpiar();
    onCerrar();
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center">
      <div
        className="absolute inset-0"
        onClick={() => {
          onCerrar();
        }}
      />

      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 shadow-lg sm:rounded-3xl dark:bg-neutral-900">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          Nueva transacción
        </h2>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTipo("egreso")}
            className={`flex-1 rounded-xl py-3 text-base font-semibold ${
              tipo === "egreso"
                ? "bg-red-600 text-white"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            Egreso
          </button>
          <button
            type="button"
            onClick={() => setTipo("ingreso")}
            className={`flex-1 rounded-xl py-3 text-base font-semibold ${
              tipo === "ingreso"
                ? "bg-emerald-600 text-white"
                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            Ingreso
          </button>
        </div>

        <label className="mt-4 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Nombre
        </label>
        <input
          autoFocus
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Pescadería"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Monto
            </label>
            <input
              inputMode="decimal"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
        </div>

        <label className="mt-3 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Categoría (opcional)
        </label>
        <CategoriaInput
          value={categoria}
          onChange={setCategoria}
          categorias={categorias}
        />

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              limpiar();
              onCerrar();
            }}
            disabled={guardando}
            className="flex-1 rounded-xl bg-neutral-100 py-3 text-base font-semibold text-neutral-700 active:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={guardar}
            disabled={guardando}
            className="flex-1 rounded-xl bg-neutral-900 py-3 text-base font-semibold text-white active:bg-neutral-700 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
