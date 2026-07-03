"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Producto } from "@/lib/types";

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refrescar = useCallback(async () => {
    setRefrescando(true);
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setProductos(data ?? []);
    }
    setRefrescando(false);
  }, []);

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
              return current
                .map((p) => (p.id === actualizado.id ? actualizado : p))
                .sort((a, b) => a.nombre.localeCompare(b.nombre));
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
    async (
      id: string,
      cambios: Partial<Pick<Producto, "nombre" | "cantidad" | "precio">>
    ) => {
      let anterior: Producto | undefined;

      setProductos((current) =>
        current
          .map((p) => {
            if (p.id !== id) return p;
            anterior = p;
            return { ...p, ...cambios };
          })
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
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

  const crearProducto = useCallback(
    async (datos: Pick<Producto, "nombre" | "cantidad" | "precio">) => {
      const nuevo: Producto = {
        id: crypto.randomUUID(),
        nombre: datos.nombre,
        cantidad: datos.cantidad,
        precio: datos.precio,
        updated_at: new Date().toISOString(),
      };

      setProductos((current) =>
        [...current, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre))
      );

      const { error } = await supabase.from("productos").insert(nuevo);

      if (error) {
        setProductos((current) => current.filter((p) => p.id !== nuevo.id));
      }

      return error;
    },
    []
  );

  const eliminarProducto = useCallback(async (id: string) => {
    let anterior: Producto | undefined;

    setProductos((current) => {
      anterior = current.find((p) => p.id === id);
      return current.filter((p) => p.id !== id);
    });

    const { error } = await supabase.from("productos").delete().eq("id", id);

    if (error && anterior) {
      const valorAnterior = anterior;
      setProductos((current) =>
        [...current, valorAnterior].sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        )
      );
    }

    return error;
  }, []);

  return {
    productos,
    loading,
    refrescando,
    error,
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    refrescar,
  };
}
