export interface IColumnasCuadreFacturacion {
  id: number | string; // CuadreFacturacion ID, can be number or empty string
  doc: string; // Tipo de documento (BOL/FAC)
  numero: string; // Combinación de Tipo y Op
  cliente: string; // Nombre completo del cliente
  ruc: string; // RUC del cliente
  vendedor: string; // Vendedor del cuadre
  subtotal: number; // Subtotal del cuadre
  igv: number | null; // IGV del cuadre
  total: number; // Monto Total (Subtotal o Monto de FacturacionOperacion)
  m: string; // Moneda (m1 de FacturacionOperacion)
  f_op: string; // Fecha de Operacion formateada
  cliente_op: string; // Cliente del cuadre
  doc_cliente_op: string; // RUC del cliente del cuadre
  monto_op: number; // Monto del cuadre
  dif_f: string; // Diferencia en Fecha (OK/Error)
  dif_m: string; // Diferencia en Monto (OK/Error)
  dif_d: string; // Diferencia en Documento (OK/Error)
  resaltarFila: { // Data for row highlighting
    active: boolean;
    data: { label: string }[];
  };
}