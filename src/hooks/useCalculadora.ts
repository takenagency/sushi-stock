"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CalculadoraProducto } from "@/lib/types";

export function useCalculadora() {
  const [productos, setProductos] = useState<CalculadoraProducto[]>([]);
  const [saldoId, setSaldoId] = useState<string | null>(null);
  const [saldoActual, setSaldoActual] = useState(0);
  const [cantidades, setCantidades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function cargar() {
      const [productosResp, saldoResp] = await Promise.all([
        supabase
          .from("calculadora_productos")
          .select("id,nombre,precio,orden")
          .order("orden", { ascending: true }),
        supabase.from("calculadora_saldo").select("id,saldo_actual").limit(1),
      ]);

      if (!active) return;

      if (productosResp.error) {
        setError(productosResp.error.message);
      } else if (saldoResp.error) {
        setError(saldoResp.error.message);
      } else {
        setProductos(productosResp.data ?? []);
        const fila = saldoResp.data?.[0];
        if (fila) {
          setSaldoId(fila.id);
          setSaldoActual(fila.saldo_actual);
        }
      }
      setLoading(false);
    }

    cargar();

    const canalProductos = supabase
      .channel("calculadora-productos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calculadora_productos" },
        (payload) => {
          setProductos((current) => {
            if (payload.eventType === "INSERT") {
              const nuevo = payload.new as CalculadoraProducto;
              if (current.some((p) => p.id === nuevo.id)) return current;
              return [...current, nuevo].sort((a, b) => a.orden - b.orden);
            }

            if (payload.eventType === "UPDATE") {
              const actualizado = payload.new as CalculadoraProducto;
              return current
                .map((p) => (p.id === actualizado.id ? actualizado : p))
                .sort((a, b) => a.orden - b.orden);
            }

            if (payload.eventType === "DELETE") {
              const eliminado = payload.old as Partial<CalculadoraProducto>;
              return current.filter((p) => p.id !== eliminado.id);
            }

            return current;
          });
        }
      )
      .subscribe();

    const canalSaldo = supabase
      .channel("calculadora-saldo-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "calculadora_saldo" },
        (payload) => {
          const fila = payload.new as { id: string; saldo_actual: number };
          setSaldoId(fila.id);
          setSaldoActual(fila.saldo_actual);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(canalProductos);
      supabase.removeChannel(canalSaldo);
    };
  }, []);

  const setCantidad = useCallback((id: string, cantidad: string) => {
    setCantidades((current) => ({ ...current, [id]: cantidad }));
  }, []);

  const reiniciarCantidades = useCallback(() => {
    setCantidades({});
  }, []);

  const actualizarPrecioProducto = useCallback(
    async (id: string, precio: number) => {
      let anterior: CalculadoraProducto | undefined;

      setProductos((current) =>
        current.map((p) => {
          if (p.id !== id) return p;
          anterior = p;
          return { ...p, precio };
        })
      );

      const { error } = await supabase
        .from("calculadora_productos")
        .update({ precio })
        .eq("id", id);

      if (error && anterior) {
        const valorAnterior = anterior;
        setProductos((current) =>
          current.map((p) => (p.id === id ? valorAnterior : p))
        );
      }
    },
    []
  );

  const crearProducto = useCallback(
    async (datos: Pick<CalculadoraProducto, "nombre" | "precio">) => {
      const ordenMaximo = productos.reduce((max, p) => Math.max(max, p.orden), 0);
      const nuevo: CalculadoraProducto = {
        id: crypto.randomUUID(),
        nombre: datos.nombre,
        precio: datos.precio,
        orden: ordenMaximo + 1,
      };

      setProductos((current) => [...current, nuevo]);

      const { error } = await supabase.from("calculadora_productos").insert(nuevo);

      if (error) {
        setProductos((current) => current.filter((p) => p.id !== nuevo.id));
      }

      return error;
    },
    [productos]
  );

  const eliminarProducto = useCallback(async (id: string) => {
    let anterior: CalculadoraProducto | undefined;

    setProductos((current) => {
      anterior = current.find((p) => p.id === id);
      return current.filter((p) => p.id !== id);
    });

    const { error } = await supabase
      .from("calculadora_productos")
      .delete()
      .eq("id", id);

    if (error && anterior) {
      const valorAnterior = anterior;
      setProductos((current) =>
        [...current, valorAnterior].sort((a, b) => a.orden - b.orden)
      );
    }

    return error;
  }, []);

  const actualizarSaldo = useCallback(
    async (nuevoSaldo: number) => {
      const anterior = saldoActual;
      setSaldoActual(nuevoSaldo);

      if (!saldoId) return;

      const { error } = await supabase
        .from("calculadora_saldo")
        .update({ saldo_actual: nuevoSaldo, updated_at: new Date().toISOString() })
        .eq("id", saldoId);

      if (error) {
        setSaldoActual(anterior);
      }
    },
    [saldoId, saldoActual]
  );

  return {
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
  };
}
