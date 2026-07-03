"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

const OPCIONES = [
  {
    href: "/stock",
    label: "Stock",
    descripcion: "Ver y actualizar el inventario",
    emoji: "📦",
  },
  {
    href: "/caja",
    label: "Caja",
    descripcion: "Ingresos, egresos y saldo",
    emoji: "💰",
  },
  {
    href: "/calculadora",
    label: "Calculadora",
    descripcion: "Calcular el total de una entrega",
    emoji: "🧮",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full flex-1 bg-neutral-50 dark:bg-neutral-950">
      <AppHeader />

      <main className="mx-auto max-w-md px-4 py-6">
        <p className="mb-4 text-center text-neutral-500 dark:text-neutral-400">
          ¿Qué querés hacer?
        </p>

        <div className="flex flex-col gap-4">
          {OPCIONES.map((opcion) => (
            <Link
              key={opcion.href}
              href={opcion.href}
              className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm active:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:active:bg-neutral-800"
            >
              <span className="text-3xl">{opcion.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {opcion.label}
                </span>
                <span className="block text-sm text-neutral-500 dark:text-neutral-400">
                  {opcion.descripcion}
                </span>
              </span>
              <span className="text-2xl text-neutral-300 dark:text-neutral-600">
                ›
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
