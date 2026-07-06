"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CalculadoraProductoRow } from "@/components/CalculadoraProductoRow";
import { NuevoCalculadoraProductoForm } from "@/components/NuevoCalculadoraProductoForm";
import { useCalculadora } from "@/hooks/useCalculadora";
import { formatearMoneda } from "@/lib/formato";

function parsear(valor: string | undefined) {
  if (!valor) return 0;
  const numero = parseFloat(valor.replace(",", "."));
  return Number.isNaN(numero) ? 0 : numero;
}

export default function CalculadoraPage() {
  const {
    productos,
    cantidades,
    saldoActual,
    loading,
    error,
    setCantidad,
    reiniciarCantidades,
    actualizarPrecioProducto,
    crearProducto,
    eliminarProducto,
    actualizarSaldo,
  } = useCalculadora();

  const [editandoSaldo, setEditandoSaldo] = useState(false);
  const [saldoInput, setSaldoInput] = useState(String(saldoActual));

  const total = useMemo(
    () =>
      productos.reduce(
        (acc, p) => acc + p.precio * parsear(cantidades[p.id]),
        0
      ),
    [productos, cantidades]
  );

  const totalACobrar = total + saldoActual;

  function abrirEdicionSaldo() {
    setSaldoInput(String(saldoActual));
    setEditandoSaldo(true);
  }

  function confirmarSaldo() {
    setEditandoSaldo(false);
    const valor = parseFloat(saldoInput.replace(",", "."));
    if (!Number.isNaN(valor) && valor !== saldoActual) {
      actualizarSaldo(valor);
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden px-3 py-2">
        <div className="mb-1.5 flex shrink-0 items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            🧮 Calculadora
          </h2>
          <button
            type="button"
            onClick={reiniciarCantidades}
            className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-600 active:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
          >
            Reiniciar cantidades
          </button>
        </div>

        {loading && (
          <p className="py-10 text-center text-neutral-500 dark:text-neutral-400">
            Cargando…
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            No se pudo conectar con la base de datos: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="max-h-full overflow-y-auto rounded-xl border border-neutral-200 bg-white px-2 dark:border-neutral-800 dark:bg-neutral-900">
              {productos.length === 0 ? (
                <p className="py-10 text-center text-neutral-500 dark:text-neutral-400">
                  Todavía no hay productos cargados.
                </p>
              ) : (
                <ul>
                  {productos.map((producto) => (
                    <CalculadoraProductoRow
                      key={producto.id}
                      producto={producto}
                      cantidad={cantidades[producto.id] ?? ""}
                      onCantidadChange={setCantidad}
                      onPrecioChange={actualizarPrecioProducto}
                      onEliminar={eliminarProducto}
                    />
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-1.5 shrink-0">
              <NuevoCalculadoraProductoForm onCrear={crearProducto} />
            </div>

            <div className="mt-1.5 shrink-0 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Total
                </span>
                <span className="font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                  ${formatearMoneda(total, 0)}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Saldo
                </span>
                {editandoSaldo ? (
                  <input
                    autoFocus
                    inputMode="decimal"
                    value={saldoInput}
                    onChange={(e) => setSaldoInput(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={confirmarSaldo}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    className="w-24 rounded border border-neutral-300 px-1.5 py-0.5 text-right text-sm tabular-nums dark:border-neutral-700 dark:bg-neutral-800"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={abrirEdicionSaldo}
                    className="rounded px-1 -mx-1 font-bold tabular-nums text-neutral-900 active:bg-neutral-100 dark:text-neutral-100 dark:active:bg-neutral-800"
                  >
                    ${formatearMoneda(saldoActual, 0)}
                  </button>
                )}
              </div>

              <div className="mt-1.5 flex items-center justify-between border-t border-neutral-100 pt-1.5 dark:border-neutral-800">
                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Total a cobrar
                </span>
                <span
                  className={`text-xl font-extrabold tabular-nums ${
                    totalACobrar < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  ${formatearMoneda(totalACobrar, 0)}
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
