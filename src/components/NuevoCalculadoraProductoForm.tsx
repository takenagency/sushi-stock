"use client";

import { useState } from "react";
import type { CalculadoraProducto } from "@/lib/types";

interface NuevoCalculadoraProductoFormProps {
  onCrear: (
    datos: Pick<CalculadoraProducto, "nombre" | "precio">
  ) => Promise<{ message: string } | null>;
}

export function NuevoCalculadoraProductoForm({
  onCrear,
}: NuevoCalculadoraProductoFormProps) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cerrarYLimpiar() {
    setAbierto(false);
    setNombre("");
    setPrecio("");
    setError(null);
  }

  async function guardar() {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      setError("Ponele un nombre al producto.");
      return;
    }

    setGuardando(true);
    setError(null);

    const resultado = await onCrear({
      nombre: nombreLimpio,
      precio: parseFloat(precio.replace(",", ".")) || 0,
    });

    setGuardando(false);

    if (resultado) {
      setError("No se pudo guardar. Probá de nuevo.");
      return;
    }

    cerrarYLimpiar();
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-300 py-1.5 text-xs font-semibold text-neutral-500 active:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:active:bg-neutral-900"
      >
        + Agregar producto
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
        Nombre
      </label>
      <input
        autoFocus
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ej: Ceviche"
        className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base dark:border-neutral-700 dark:bg-neutral-800"
      />

      <label className="mt-3 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
        Precio unidad
      </label>
      <input
        inputMode="decimal"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="0"
        className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
      />

      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={cerrarYLimpiar}
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
  );
}
