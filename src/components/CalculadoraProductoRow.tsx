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
      <li className="flex items-center justify-between gap-2 border-b border-red-100 bg-red-50 py-1.5 pl-1 pr-0.5 text-xs last:border-0 dark:border-red-900 dark:bg-red-950">
        <span className="min-w-0 truncate font-medium text-red-900 dark:text-red-100">
          ¿Eliminar &ldquo;{producto.nombre}&rdquo;?
        </span>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setConfirmandoEliminar(false)}
            className="rounded-md bg-white px-2 py-1 font-semibold text-neutral-700 active:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(producto.id)}
            className="rounded-md bg-red-600 px-2 py-1 font-semibold text-white active:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-1.5 border-b border-neutral-100 py-1.5 last:border-0 dark:border-neutral-800">
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {producto.nombre}
      </span>

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
          className="w-16 shrink-0 rounded border border-neutral-300 px-1 py-0.5 text-right text-xs tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
        />
      ) : (
        <button
          type="button"
          onClick={abrirEdicionPrecio}
          className="w-16 shrink-0 rounded py-0.5 text-right text-xs text-neutral-500 tabular-nums active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
        >
          ${formatearMoneda(producto.precio, 0)}
        </button>
      )}

      <span className="shrink-0 text-xs text-neutral-300 dark:text-neutral-600">
        ×
      </span>

      <input
        inputMode="decimal"
        value={cantidad}
        onChange={(e) => onCantidadChange(producto.id, e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        placeholder="0"
        className="w-9 shrink-0 rounded border border-neutral-300 px-0.5 py-0.5 text-center text-sm font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
      />

      <span className="w-16 shrink-0 text-right text-sm font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
        ${formatearMoneda(subtotal, 0)}
      </span>

      <button
        type="button"
        aria-label="Eliminar producto"
        onClick={() => setConfirmandoEliminar(true)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-neutral-300 active:bg-red-50 active:text-red-600 dark:text-neutral-600 dark:active:bg-red-950 dark:active:text-red-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      </button>
    </li>
  );
}
