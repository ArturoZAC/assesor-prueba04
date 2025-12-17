/**
 * Limpia errores de precisión de punto flotante
 * Ejemplo: 3.74500000000003 → 3.745
 */
export const limpiarPrecision = (valor: number, decimales: number = 10): number => {
    if (isNaN(valor)) return 0;
    return parseFloat(valor.toFixed(decimales));
  };
  
  /**
   * Redondea para almacenamiento en BD
   * Para TC: 4 decimales
   * Para montos: mantiene alta precisión (10 decimales)
   */
  export const redondearParaBD = (valor: number, decimales: number = 10): number => {
    if (isNaN(valor)) return 0;
    return parseFloat(Number(valor).toFixed(decimales));
  };
  
  /**
   * Redondea TC para BD (4 decimales)
   */
  export const redondearTCParaBD = (valor: number): number => {
    if (isNaN(valor)) return 0;
    return parseFloat(Number(valor).toFixed(4));
  };
  
  /**
   * Formatea para VISUALIZACIÓN (no afecta cálculos)
   * Simula el comportamiento de "reducir decimales" de Excel
   */
  export const formatearVisual = (valor: number, decimales: number = 2): string => {
    if (isNaN(valor)) return "0.00";
    return valor.toFixed(decimales);
  };
  
  /**
   * Formatea TC para visualización (3 decimales)
   */
  export const formatearTCVisual = (valor: number): string => {
    if (isNaN(valor)) return "0.000";
    return valor.toFixed(3);
  };