export interface MonthlyTotal {
  fecha: string; // "Enero 2025", "Febrero 2025", "Acumulado 2025"
  totalCapitalSoles: number;
  totalCapitalDolares: number;
  totalInteres: number;
  totalCobroTotal: number;
  totalTc: number;
  totalPotencial: number;
  totalIgv: number;
  totalRendimiento: number;
  totalGanancia: number;
  totalDetraccion: number;
  promedioDias: number | null;
  promedioTasa: number | null;
}