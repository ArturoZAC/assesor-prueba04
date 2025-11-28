export interface MonthlyTotal {
  fecha: string;
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