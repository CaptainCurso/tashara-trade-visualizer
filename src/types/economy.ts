export type GoodCategory =
  | "food"
  | "textile"
  | "material"
  | "technology"
  | "knowledge"
  | "luxury"
  | "biological"
  | "artifice";

export type SupplyLevel = "surplus" | "steady" | "scarce" | "none";
export type DemandLevel = "high" | "moderate" | "low" | "none";

export type OrbitalBodyKind = "star" | "planet" | "station" | "gate" | "barycenter";
export type OrbitalMotionMode =
  | "fixed"
  | "circular"
  | "binary-child"
  | "elliptical"
  | "hyperbolic";

export type LocationKind =
  | "star"
  | "world"
  | "hub"
  | "gate"
  | "wildspace";

export interface CoordinateAu {
  x: number;
  y: number;
}

export interface LabelOffset {
  x: number;
  y: number;
}

export interface GoodDefinition {
  id: string;
  name: string;
  category: GoodCategory;
  baselinePriceGp: number;
  unit: string;
  tags: string[];
  notes?: string;
}

export interface MarketEntry {
  goodId: string;
  buyModifier?: number;
  sellModifier?: number;
  supply: SupplyLevel;
  demand: DemandLevel;
  notes?: string;
}

export interface TradeBonus {
  label: string;
  description: string;
  type?: "price" | "service" | "risk" | "faction";
  value?: number;
}

export interface TradeConstraint {
  label: string;
  description: string;
  severity: "low" | "moderate" | "high";
}

export interface Modifier {
  type: string;
  value: number;
  description: string;
}

export interface OrbitalBody {
  id: string;
  name: string;
  kind: OrbitalBodyKind;
  motionMode: OrbitalMotionMode;
  description: string;
  color: string;
  accentColor?: string;
  symbolSize: number;
  fixedCoordinatesAu?: CoordinateAu;
  radiusAu?: number;
  semiMajorAu?: number;
  semiMinorAu?: number;
  centerOffsetAu?: CoordinateAu;
  rotationDeg?: number;
  routeStartBodyId?: string;
  routeEndBodyId?: string;
  periapsisCoordinatesAu?: CoordinateAu;
  hyperbolaA?: number;
  hyperbolaB?: number;
  parameterStart?: number;
  parameterEnd?: number;
  orbitalPeriodDays?: number;
  phaseDeg?: number;
  parentId?: string;
  localOrbitRadiusAu?: number;
  localOrbitPeriodDays?: number;
  labelOffset?: LabelOffset;
  showOrbit?: boolean;
}

export interface Location {
  id: string;
  name: string;
  shortName?: string;
  type: LocationKind;
  orbitalBodyId?: string;
  description: string;
  shortDescription: string;
  primarySettlement?: string;
  population?: string;
  currency?: string;
  factions: string[];
  produces: string[];
  demands: string[];
  bonuses: TradeBonus[];
  rules: TradeConstraint[];
  notes: string[];
  market: MarketEntry[];
}

export interface RouteDefinition {
  id: string;
  from: string;
  to: string;
  routeType: "established" | "hazardous" | "frontier" | "service" | "gate";
  risk: "low" | "moderate" | "high";
  travelNotes: string[];
  modifiers: Modifier[];
}

export interface GlobalSettings {
  shipSpeedAuPerDay: number;
  shipCargoCapacityTons: number;
  bralSpeedAuPerWeek: number;
  timeModel: {
    currentDay: number;
    minDay: number;
    maxDay: number;
    label: string;
    notes: string;
  };
  economyNotes: string[];
  orbitalDisplay: {
    maxMapRadiusAu: number;
    gateRadiusAu: number;
    gateAnglesDeg: {
      spiral: number;
      coreward: number;
    };
    bralGateToGateDays: number;
  };
}

export interface TradeEstimate {
  originId: string;
  destinationId: string;
  goodId: string;
  quantity: number;
  purchaseCostGp: number;
  saleValueGp: number;
  netProfitGp: number;
  profitPerDayGp: number;
  profitPerAuGp: number;
  distanceAu: number;
  travelTimeDays: number;
  route?: RouteDefinition;
}

export interface RouteComparisonFilters {
  originId: string;
  destinationId: string;
  category: GoodCategory | "all";
  sortBy: "profitPerDay" | "netProfit" | "profitPerAu";
}

export interface ShipCargoEntry {
  id: string;
  goodId: string;
  quantityTons: number;
  loadedAtLocationId: string;
  purchasePricePerTonGp: number;
}

export interface ShipState {
  originId: string;
  destinationId: string;
  status: "docked" | "in_transit";
  positionAu: CoordinateAu;
  cargo: ShipCargoEntry[];
}
