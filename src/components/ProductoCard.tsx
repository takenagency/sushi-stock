"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Producto } from "@/lib/types";

function formatearPrecio(precio: number) {
  return precio.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function ProductoCard({ producto }: { producto: Producto }) {
  const [busy, setBusy] = useState(false);
  const [editandoCantidad, setEditandoCantidad] = useState(false);
  const [cantidadInput, setCantidadInput] = useState(String(producto.cantidad));
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [precioInput, setPrecioInput] = useState(String(producto.precio));

  async function guardarCantidad(nuevaCantidad: number) {
    if (Number.isNaN(nuevaCantidad) || nuevaCantidad < 0) return;
    setBusy(true);
    await supabase
      .from("productos")
      .update({ cantidad: nuevaCantidad, updated_at: new Date().toISOString() })
      .eq("id", producto.id);
    setBusy(false);
  }

  async function guardarPrecio(nuevoPrecio: number) {
    if (Number.isNaN(nuevoPrecio) || nuevoPrecio < 0) return;
    setBusy(true);
    await supabase
      .from("productos")
      .update({ precio: nuevoPrecio, updated_at: new Date().toISOString() })
      .eq("id", producto.id);
    setBusy(false);
  }

  function ajustar(delta: number) {
    if (busy) return;
    guardarCantidad(producto.cantidad + delta);
  }

  function abrirEdicionCantidad() {
    setCantidadInput(String(producto.cantidad));
    setEditandoCantidad(true);
  }

  function confirmarCantidad() {
    setEditandoCantidad(false);
    const valor = parseFloat(cantidadInput.replace(",", "."));
    if (!Number.isNaN(valor) && valor !== producto.cantidad) {
      guardarCantidad(valor);
    }
  }

  function abrirEdicionPrecio() {
    setPrecioInput(String(producto.precio));
    setEditandoPrecio(true);
  }

  function confirmarPrecio() {
    setEditandoPrecio(false);
    const valor = parseFloat(precioInput.replace(",", "."));
    if (!Number.isNaN(valor) && valor !== producto.precio) {
      guardarPrecio(valor);
    }
  }

  return (
    <li className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-lg font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
        {producto.nombre}
      </p>

      <div className="mt-2 flex items-center justify-between gap-3">
        {editandoPrecio ? (
          <input
            autoFocus
            inputMode="decimal"
            value={precioInput}
            onChange={(e) => setPrecioInput(e.target.value)}
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
            ${formatearPrecio(producto.precio)}
          </button>
        )}

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Restar"
            disabled={busy}
            onClick={() => ajustar(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl font-bold text-neutral-700 active:bg-neutral-200 disabled:opacity-40 dark:bg-neutral-800 dark:text-neutral-200 dark:active:bg-neutral-700"
          >
            −
          </button>

          {editandoCantidad ? (
            <input
              autoFocus
              inputMode="decimal"
              value={cantidadInput}
              onChange={(e) => setCantidadInput(e.target.value)}
              onBlur={confirmarCantidad}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="w-16 rounded-lg border border-neutral-300 px-1 py-2 text-center text-xl font-bold tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
            />
          ) : (
            <button
              type="button"
              onClick={abrirEdicionCantidad}
              className="w-16 rounded-lg py-2 text-center text-xl font-bold tabular-nums text-neutral-900 active:bg-neutral-100 dark:text-neutral-100 dark:active:bg-neutral-800"
            >
              {producto.cantidad}
            </button>
          )}

          <button
            type="button"
            aria-label="Sumar"
            disabled={busy}
            onClick={() => ajustar(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl font-bold text-neutral-700 active:bg-neutral-200 disabled:opacity-40 dark:bg-neutral-800 dark:text-neutral-200 dark:active:bg-neutral-700"
          >
            +
          </button>
        </div>
      </div>
    </li>
  );
}
