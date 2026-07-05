"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Transaccion } from "@/lib/types";

function ordenar(lista: Transaccion[]) {
  return [...lista].sort((a, b) => {
    if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
    return b.created_at.localeCompare(a.created_at);
  });
}

export function useTransacciones() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refrescar = useCallback(async () => {
    const { data, error } = await supabase.from("transacciones").select("*");

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setTransacciones(ordenar(data ?? []));
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchTransacciones() {
      const { data, error } = await supabase.from("transacciones").select("*");

      if (!active) return;

      if (error) {
        setError(error.message);
      } else {
        setTransacciones(ordenar(data ?? []));
      }
      setLoading(false);
    }

    fetchTransacciones();

    const channel = supabase
      .channel("transacciones-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transacciones" },
        (payload) => {
          setTransacciones((current) => {
            if (payload.eventType === "INSERT") {
              const nueva = payload.new as Transaccion;
              if (current.some((t) => t.id === nueva.id)) return current;
              return ordenar([...current, nueva]);
            }

            if (payload.eventType === "UPDATE") {
              const actualizada = payload.new as Transaccion;
              return ordenar(
                current.map((t) => (t.id === actualizada.id ? actualizada : t))
              );
            }

            if (payload.eventType === "DELETE") {
              const eliminada = payload.old as Partial<Transaccion>;
              return current.filter((t) => t.id !== eliminada.id);
            }

            return current;
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const crearTransaccion = useCallback(
    async (
      datos: Pick<
        Transaccion,
        "tipo" | "nombre" | "monto" | "categoria" | "fecha"
      >
    ) => {
      const nueva: Transaccion = {
        id: crypto.randomUUID(),
        tipo: datos.tipo,
        nombre: datos.nombre,
        monto: datos.monto,
        categoria: datos.categoria,
        fecha: datos.fecha,
        created_at: new Date().toISOString(),
      };

      setTransacciones((current) => ordenar([...current, nueva]));

      const { error } = await supabase.from("transacciones").insert(nueva);

      if (error) {
        setTransacciones((current) => current.filter((t) => t.id !== nueva.id));
      }

      return error;
    },
    []
  );

  const actualizarTransaccion = useCallback(
    async (
      id: string,
      cambios: Partial<
        Pick<Transaccion, "tipo" | "nombre" | "monto" | "categoria" | "fecha">
      >
    ) => {
      let anterior: Transaccion | undefined;

      setTransacciones((current) =>
        ordenar(
          current.map((t) => {
            if (t.id !== id) return t;
            anterior = t;
            return { ...t, ...cambios };
          })
        )
      );

      const { error } = await supabase
        .from("transacciones")
        .update(cambios)
        .eq("id", id);

      if (error && anterior) {
        const valorAnterior = anterior;
        setTransacciones((current) =>
          ordenar(current.map((t) => (t.id === id ? valorAnterior : t)))
        );
      }

      return error;
    },
    []
  );

  const eliminarTransaccion = useCallback(async (id: string) => {
    let anterior: Transaccion | undefined;

    setTransacciones((current) => {
      anterior = current.find((t) => t.id === id);
      return current.filter((t) => t.id !== id);
    });

    const { error } = await supabase.from("transacciones").delete().eq("id", id);

    if (error && anterior) {
      const valorAnterior = anterior;
      setTransacciones((current) => ordenar([...current, valorAnterior]));
    }

    return error;
  }, []);

  const saldo = useMemo(
    () =>
      transacciones.reduce(
        (acc, t) => acc + (t.tipo === "ingreso" ? t.monto : -t.monto),
        0
      ),
    [transacciones]
  );

  const categorias = useMemo(() => {
    const set = new Set<string>();
    for (const t of transacciones) {
      if (t.categoria) set.add(t.categoria);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [transacciones]);

  return {
    transacciones,
    loading,
    error,
    saldo,
    categorias,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion,
    refrescar,
  };
}
