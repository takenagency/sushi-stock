export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  updated_at: string;
}

export type TipoTransaccion = "ingreso" | "egreso";

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  nombre: string;
  monto: number;
  categoria: string | null;
  fecha: string;
  created_at: string;
}

export interface CalculadoraProducto {
  id: string;
  nombre: string;
  precio: number;
  orden: number;
}

export interface CalculadoraSaldo {
  id: string;
  saldo_actual: number;
  updated_at: string;
}
