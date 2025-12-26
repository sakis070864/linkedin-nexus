
export enum DevelopmentType {
  HOUSES = 'Houses',
  APARTMENTS = 'Apartments',
  MIXED_USE = 'Mixed Use'
}

export interface ProjectData {
  id: string;
  address: string;
  plotSize: number;
  plotCost: number;
  constructionCostPerM2: number;
  additionalExpenses: number;
  buildFactor: number;
  expectedSellingPricePerM2: number;
  developmentType: DevelopmentType;
}

export interface FinancialResults {
  totalLandCost: number;
  totalConstructionCost: number;
  totalAdditionalExpenses: number;
  totalProjectCost: number;
  buildableArea: number;
  totalRevenue: number;
  totalProfit: number;
  profitPerM2: number;
  roi: number;
}

export interface UnitScenario {
  type: string;
  unitCount: number;
  avgUnitSize: number;
  revenuePerUnit: number;
}
