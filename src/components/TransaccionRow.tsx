import { formatearFecha, formatearMoneda } from "@/lib/formato";
import type { Transaccion } from "@/lib/types";

interface TransaccionRowProps {
  transaccion: Transaccion;
  onClick: (transaccion: Transaccion) => void;
}

export function TransaccionRow({ transaccion, onClick }: TransaccionRowProps) {
  const esIngreso = transaccion.tipo === "ingreso";

  return (
    <li className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
      <button
        type="button"
        onClick={() => onClick(transaccion)}
        className="flex w-full items-center justify-between gap-3 py-3 text-left active:bg-neutral-50 dark:active:bg-neutral-800/50"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
            {transaccion.nombre}
          </p>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            {formatearFecha(transaccion.fecha)}
            {transaccion.categoria && (
              <>
                {" · "}
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                  {transaccion.categoria}
                </span>
              </>
            )}
          </p>
        </div>

        <span
          className={`shrink-0 text-lg font-bold tabular-nums ${
            esIngreso
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          $ {formatearMoneda(transaccion.monto)}
        </span>
      </button>
    </li>
  );
}
