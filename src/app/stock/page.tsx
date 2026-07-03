"use client";

import { useProductos } from "@/hooks/useProductos";
import { ProductoCard } from "@/components/ProductoCard";
import { NuevoProductoForm } from "@/components/NuevoProductoForm";
import { AppHeader } from "@/components/AppHeader";

export default function StockPage() {
  const {
    productos,
    loading,
    refrescando,
    error,
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    refrescar,
  } = useProductos();

  return (
    <div className="min-h-full flex-1 bg-neutral-50 dark:bg-neutral-950">
      <AppHeader />

      <main className="mx-auto max-w-md px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            📦 Stock
          </h2>
          <button
            type="button"
            aria-label="Actualizar"
            onClick={refrescar}
            disabled={refrescando}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 active:bg-neutral-200 disabled:opacity-50 dark:text-neutral-400 dark:active:bg-neutral-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-5 w-5 ${refrescando ? "animate-spin" : ""}`}
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        </div>

        {loading && (
          <p className="py-10 text-center text-neutral-500 dark:text-neutral-400">
            Cargando productos…
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            No se pudo conectar con la base de datos: {error}
          </p>
        )}

        {!loading && !error && productos.length === 0 && (
          <p className="py-10 text-center text-neutral-500 dark:text-neutral-400">
            Todavía no hay productos cargados.
          </p>
        )}

        {!loading && !error && productos.length > 0 && (
          <ul className="flex flex-col gap-3">
            {productos.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onActualizar={actualizarProducto}
                onEliminar={eliminarProducto}
              />
            ))}
          </ul>
        )}

        {!loading && !error && (
          <div className="mt-3">
            <NuevoProductoForm onCrear={crearProducto} />
          </div>
        )}
      </main>
    </div>
  );
}
