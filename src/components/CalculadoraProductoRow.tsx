"use client";

import { useState } from "react";
import { formatearMoneda } from "@/lib/formato";
import type { CalculadoraProducto } from "@/lib/types";

interface CalculadoraProductoRowProps {
  producto: CalculadoraProducto;
  cantidad: string;
  onCantidadChange: (id: string, valor: string) => void;
  onPrecioChange: (id: string, precio: number) => void;
  onEliminar: (id: string) => void;
}

export function CalculadoraProductoRow({
  producto,
  cantidad,
  onCantidadChange,
  onPrecioChange,
  onEliminar,
}: CalculadoraProductoRowProps) {
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [precioInput, setPrecioInput] = useState(String(producto.precio));
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

  const subtotal = producto.precio * (parseFloat(cantidad.replace(",", ".")) || 0);

  function abrirEdicionPrecio() {
    setPrecioInput(String(producto.precio));
    setEditandoPrecio(true);
  }

  function confirmarPrecio() {
    setEditandoPrecio(false);
    const valor = parseFloat(precioInput.replace(",", "."));
    if (!Number.isNaN(valor) && valor >= 0 && valor !== producto.precio) {
      onPrecioChange(producto.id, valor);
    }
  }

  if (confirmandoEliminar) {
    return (
      <li className="flex items-center justify-between gap-2 border-b border-red-100 bg-red-50 px-2 py-3 last:border-0 dark:border-red-900 dark:bg-red-950">
        <span className="text-sm font-medium text-red-900 dark:text-red-100">
          ¿Eliminar &ldquo;{producto.nombre}&rdquo;?
        </span>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConfirmandoEliminar(false)}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 active:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(producto.id)}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white active:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="border-b border-neutral-100 py-3 last:border-0 dark:border-neutral-800">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 flex-1 truncate font-semibold text-neutral-900 dark:text-neutral-100">
          {producto.nombre}
        </span>
        <button
          type="button"
          aria-label="Eliminar producto"
          onClick={() => setConfirmandoEliminar(true)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-300 active:bg-red-50 active:text-red-600 dark:text-neutral-600 dark:active:bg-red-950 dark:active:text-red-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        {editandoPrecio ? (
          <input
            autoFocus
            inputMode="decimal"
            value={precioInput}
            onChange={(e) => setPrecioInput(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={confirmarPrecio}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="w-24 rounded-lg border border-neutral-300 px-2 py-2 text-sm tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
          />
        ) : (
          <button
            type="button"
            onClick={abrirEdicionPrecio}
            className="w-24 shrink-0 rounded-lg py-2 text-left text-sm text-neutral-500 tabular-nums active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
          >
            ${formatearMoneda(producto.precio, 0)}
          </button>
        )}

        <span className="text-neutral-300 dark:text-neutral-600">×</span>

        <input
          inputMode="decimal"
          value={cantidad}
          onChange={(e) => onCantidadChange(producto.id, e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          placeholder="0"
          className="w-16 rounded-lg border border-neutral-300 px-2 py-2 text-center text-base font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
        />

        <span className="ml-auto min-w-0 flex-1 text-right text-base font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
          ${formatearMoneda(subtotal, 0)}
        </span>
      </div>
    </li>
  );
}
