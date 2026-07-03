"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const OPCIONES = [
  { href: "/", label: "Home" },
  { href: "/stock", label: "Stock" },
  { href: "/caja", label: "Caja" },
  { href: "/calculadora", label: "Calculadora" },
];

export function AppHeader() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          🍣 Bonifacio
        </h1>

        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setAbierto(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-neutral-100 dark:text-neutral-200 dark:active:bg-neutral-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>
      </div>

      {abierto && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/30"
            onClick={() => setAbierto(false)}
          />
          <nav className="fixed right-4 top-16 z-40 w-48 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            {OPCIONES.map((opcion) => {
              const activo = pathname === opcion.href;
              return (
                <Link
                  key={opcion.href}
                  href={opcion.href}
                  onClick={() => setAbierto(false)}
                  className={`block px-4 py-3 text-base font-medium active:bg-neutral-100 dark:active:bg-neutral-800 ${
                    activo
                      ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {opcion.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}
