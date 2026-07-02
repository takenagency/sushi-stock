"use client";

import { useProductos } from "@/hooks/useProductos";
import { ProductoCard } from "@/components/ProductoCard";

export default function Home() {
  const { productos, loading, error } = useProductos();

  return (
    <div className="min-h-full flex-1 bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            🍣 Sushi Stock
          </h1>
          {!error && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              En vivo
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-4">
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
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
