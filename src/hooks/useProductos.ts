"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Producto } from "@/lib/types";

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchProductos() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("nombre", { ascending: true });

      if (!active) return;

      if (error) {
        setError(error.message);
      } else {
        setProductos(data ?? []);
      }
      setLoading(false);
    }

    fetchProductos();

    const channel = supabase
      .channel("productos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "productos" },
        (payload) => {
          setProductos((current) => {
            if (payload.eventType === "INSERT") {
              const nuevo = payload.new as Producto;
              if (current.some((p) => p.id === nuevo.id)) return current;
              return [...current, nuevo].sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
              );
            }

            if (payload.eventType === "UPDATE") {
              const actualizado = payload.new as Producto;
              return current.map((p) =>
                p.id === actualizado.id ? actualizado : p
              );
            }

            if (payload.eventType === "DELETE") {
              const eliminado = payload.old as Partial<Producto>;
              return current.filter((p) => p.id !== eliminado.id);
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

  const actualizarProducto = useCallback(
    async (id: string, cambios: Partial<Pick<Producto, "cantidad" | "precio">>) => {
      let anterior: Producto | undefined;

      setProductos((current) =>
        current.map((p) => {
          if (p.id !== id) return p;
          anterior = p;
          return { ...p, ...cambios };
        })
      );

      const { error } = await supabase
        .from("productos")
        .update({ ...cambios, updated_at: new Date().toISOString() })
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

  return { productos, loading, error, actualizarProducto };
}
