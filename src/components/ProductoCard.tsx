"use client";

import { useState } from "react";
import type { Producto } from "@/lib/types";

function formatearPrecio(precio: number) {
  return precio.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

interface ProductoCardProps {
  producto: Producto;
  onActualizar: (
    id: string,
    cambios: Partial<Pick<Producto, "nombre" | "cantidad" | "precio">>
  ) => void;
  onEliminar: (id: string) => void;
}

export function ProductoCard({
  producto,
  onActualizar,
  onEliminar,
}: ProductoCardProps) {
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreInput, setNombreInput] = useState(producto.nombre);
  const [editandoCantidad, setEditandoCantidad] = useState(false);
  const [cantidadInput, setCantidadInput] = useState(String(producto.cantidad));
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [precioInput, setPrecioInput] = useState(String(producto.precio));
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);

  const valorEnStock = producto.precio * producto.cantidad;
  const sinStock = producto.cantidad === 0;

  function abrirEdicionNombre() {
    setNombreInput(producto.nombre);
    setEditandoNombre(true);
  }

  function confirmarNombre() {
    setEditandoNombre(false);
    const valor = nombreInput.trim();
    if (valor && valor !== producto.nombre) {
      onActualizar(producto.id, { nombre: valor });
    }
  }

  function ajustar(delta: number) {
    const nuevaCantidad = producto.cantidad + delta;
    if (nuevaCantidad < 0) return;
    onActualizar(producto.id, { cantidad: nuevaCantidad });
  }

  function abrirEdicionCantidad() {
    setCantidadInput(String(producto.cantidad));
    setEditandoCantidad(true);
  }

  function confirmarCantidad() {
    setEditandoCantidad(false);
    const valor = parseFloat(cantidadInput.replace(",", "."));
    if (!Number.isNaN(valor) && valor >= 0 && valor !== producto.cantidad) {
      onActualizar(producto.id, { cantidad: valor });
    }
  }

  function abrirEdicionPrecio() {
    setPrecioInput(String(producto.precio));
    setEditandoPrecio(true);
  }

  function confirmarPrecio() {
    setEditandoPrecio(false);
    const valor = parseFloat(precioInput.replace(",", "."));
    if (!Number.isNaN(valor) && valor >= 0 && valor !== producto.precio) {
      onActualizar(producto.id, { precio: valor });
    }
  }

  if (confirmandoEliminar) {
    return (
      <li className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900 dark:bg-red-950">
        <p className="text-base font-semibold text-red-900 dark:text-red-100">
          ¿Eliminar &ldquo;{producto.nombre}&rdquo;?
        </p>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          Esta acción no se puede deshacer.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setConfirmandoEliminar(false)}
            className="flex-1 rounded-xl bg-white py-3 text-base font-semibold text-neutral-700 active:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onEliminar(producto.id)}
            className="flex-1 rounded-xl bg-red-600 py-3 text-base font-semibold text-white active:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </li>
    );
  }

  return (
    <li
      className={`rounded-2xl border p-4 shadow-sm ${
        sinStock
          ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950"
          : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        {editandoNombre ? (
          <input
            autoFocus
            value={nombreInput}
            onChange={(e) => setNombreInput(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={confirmarNombre}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="w-full rounded-lg border border-neutral-300 px-2 py-1 text-lg font-semibold dark:border-neutral-700 dark:bg-neutral-800"
          />
        ) : (
          <button
            type="button"
            onClick={abrirEdicionNombre}
            className="-mx-1 min-w-0 flex-1 rounded-lg px-1 text-left text-lg font-semibold leading-snug text-neutral-900 active:bg-neutral-100 dark:text-neutral-100 dark:active:bg-neutral-800"
          >
            {producto.nombre}
          </button>
        )}

        {!editandoNombre && (
          <button
            type="button"
            aria-label="Eliminar producto"
            onClick={() => setConfirmandoEliminar(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-400 active:bg-red-50 active:text-red-600 dark:active:bg-red-950 dark:active:text-red-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
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
            className="w-28 rounded-lg border border-neutral-300 px-2 py-1 text-base tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
          />
        ) : (
          <button
            type="button"
            onClick={abrirEdicionPrecio}
            className="rounded-lg px-1 -mx-1 text-base text-neutral-500 tabular-nums active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
          >
            ${formatearPrecio(producto.precio)} <span className="text-neutral-400 dark:text-neutral-500">/u</span>
          </button>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Restar"
            onClick={() => ajustar(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl font-bold text-neutral-700 active:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:active:bg-neutral-700"
          >
            −
          </button>

          {editandoCantidad ? (
            <input
              autoFocus
              inputMode="decimal"
              value={cantidadInput}
              onChange={(e) => setCantidadInput(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              onBlur={confirmarCantidad}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="w-20 rounded-lg border border-neutral-300 px-1 py-2 text-center text-xl font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
            />
          ) : (
            <button
              type="button"
              onClick={abrirEdicionCantidad}
              className="w-20 rounded-lg py-2 text-center text-xl font-bold tabular-nums text-neutral-900 active:bg-neutral-100 dark:text-neutral-100 dark:active:bg-neutral-800"
            >
              {producto.cantidad}
            </button>
          )}

          <button
            type="button"
            aria-label="Sumar"
            onClick={() => ajustar(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl font-bold text-neutral-700 active:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:active:bg-neutral-700"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2 text-sm dark:border-neutral-800">
        <span className="text-neutral-500 dark:text-neutral-400">
          Valor en stock
        </span>
        <span className="font-semibold tabular-nums text-neutral-700 dark:text-neutral-300">
          ${formatearPrecio(valorEnStock)}
        </span>
      </div>
    </li>
  );
}
