"use client";

import { useState } from "react";

interface CategoriaInputProps {
  value: string;
  onChange: (valor: string) => void;
  categorias: string[];
}

export function CategoriaInput({
  value,
  onChange,
  categorias,
}: CategoriaInputProps) {
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  const filtradas = categorias.filter((c) =>
    c.toLowerCase().includes(value.trim().toLowerCase())
  );

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setMostrarSugerencias(true)}
        onBlur={() => setTimeout(() => setMostrarSugerencias(false), 150)}
        placeholder="Ej: Insumos"
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base dark:border-neutral-700 dark:bg-neutral-800"
      />

      {mostrarSugerencias && filtradas.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {filtradas.map((categoria) => (
            <li key={categoria}>
              <button
                type="button"
                onClick={() => {
                  onChange(categoria);
                  setMostrarSugerencias(false);
                }}
                className="block w-full px-3 py-2 text-left text-base active:bg-neutral-100 dark:active:bg-neutral-700"
              >
                {categoria}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
