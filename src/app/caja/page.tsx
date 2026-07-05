"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { TransaccionRow } from "@/components/TransaccionRow";
import { NuevaTransaccionForm } from "@/components/NuevaTransaccionForm";
import { FiltrosCaja, FILTROS_VACIOS, type FiltrosCajaState } from "@/components/FiltrosCaja";
import { useTransacciones } from "@/hooks/useTransacciones";
import { formatearMoneda } from "@/lib/formato";
import type { Transaccion } from "@/lib/types";

export default function CajaPage() {
  const {
    transacciones,
    loading,
    error,
    saldo,
    categorias,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
  } = useTransacciones();
  const [filtros, setFiltros] = useState<FiltrosCajaState>(FILTROS_VACIOS);
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [transaccionEditando, setTransaccionEditando] =
    useState<Transaccion | null>(null);

  function abrirNueva() {
    setTransaccionEditando(null);
    setFormularioAbierto(true);
  }

  function abrirEdicion(transaccion: Transaccion) {
    setTransaccionEditando(transaccion);
    setFormularioAbierto(true);
  }

  const transaccionesFiltradas = useMemo(() => {
    return transacciones.filter((t) => {
      if (filtros.tipo !== "todos" && t.tipo !== filtros.tipo) return false;
      if (filtros.categoria && t.categoria !== filtros.categoria) return false;
      if (filtros.desde && t.fecha < filtros.desde) return false;
      if (filtros.hasta && t.fecha > filtros.hasta) return false;
      return true;
    });
  }, [transacciones, filtros]);

  return (
    <div className="min-h-full flex-1 bg-neutral-50 dark:bg-neutral-950">
      <AppHeader />

      <main className="mx-auto max-w-md px-4 py-4 pb-28">
        <h2 className="mb-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          💰 Caja
        </h2>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Saldo actual
          </p>
          <p
            className={`mt-1 text-3xl font-extrabold tabular-nums ${
              saldo > 0
                ? "text-emerald-600 dark:text-emerald-400"
                : saldo < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            $ {formatearMoneda(saldo)}
          </p>
        </div>

        <div className="mt-4">
          <FiltrosCaja
            filtros={filtros}
            onChange={setFiltros}
            categorias={categorias}
          />
        </div>

        {loading && (
          <p className="py-10 text-center text-neutral-500 dark:text-neutral-400">
            Cargando movimientos…
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            No se pudo conectar con la base de datos: {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-4 rounded-2xl border border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
            {transaccionesFiltradas.length === 0 ? (
              <p className="py-10 text-center text-neutral-500 dark:text-neutral-400">
                No hay movimientos para mostrar.
              </p>
            ) : (
              <ul>
                {transaccionesFiltradas.map((transaccion) => (
                  <TransaccionRow
                    key={transaccion.id}
                    transaccion={transaccion}
                    onClick={abrirEdicion}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <button
        type="button"
        aria-label="Nueva transacción"
        onClick={abrirNueva}
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-3xl font-light text-white shadow-lg active:bg-neutral-700 dark:bg-white dark:text-neutral-900"
      >
        +
      </button>

      <NuevaTransaccionForm
        abierto={formularioAbierto}
        categorias={categorias}
        transaccion={transaccionEditando}
        onCerrar={() => setFormularioAbierto(false)}
        onCrear={crearTransaccion}
        onActualizar={actualizarTransaccion}
        onEliminar={eliminarTransaccion}
      />
    </div>
  );
}
