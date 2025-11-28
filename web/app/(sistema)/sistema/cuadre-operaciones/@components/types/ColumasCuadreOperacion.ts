export type CuadreOperacion = {
  id: number;
  operacionId: number;
  fecha_usd: Date;
  descripcion_op_usd: string;
  monto_usd: number;
  referencia_usd: string;
  diferencia_usd: number;
  fecha_pen: Date;
  descripcion_op_pen: string;
  monto_pen: number;
  referencia_pen: string;
  diferencia_pen: number;
  created_at: Date;
  updated_at: Date;
};
