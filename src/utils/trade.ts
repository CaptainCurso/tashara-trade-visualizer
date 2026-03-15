import type {
  CoordinateAu,
  GlobalSettings,
  GoodDefinition,
  Location,
  MarketEntry,
  OrbitalBody,
  RouteComparisonFilters,
  RouteDefinition,
  TradeEstimate,
} from "../types/economy";
import { getDistanceAu, getOrbitalBodyMap, getOrbitalPositionAu } from "./orbital";

export function getMarketEntry(location: Location, goodId: string): MarketEntry | undefined {
  return location.market.find((entry) => entry.goodId === goodId);
}

export function getBuyPriceGp(location: Location, good: GoodDefinition): number | null {
  const entry = getMarketEntry(location, good.id);
  if (!entry?.buyModifier) {
    return null;
  }

  return good.baselinePriceGp * entry.buyModifier;
}

export function getSellPriceGp(location: Location, good: GoodDefinition): number | null {
  const entry = getMarketEntry(location, good.id);
  if (!entry?.sellModifier) {
    return null;
  }

  return good.baselinePriceGp * entry.sellModifier;
}

export function findRouteDefinition(
  routes: RouteDefinition[],
  fromId: string,
  toId: string,
): RouteDefinition | undefined {
  return routes.find(
    (route) =>
      (route.from === fromId && route.to === toId) ||
      (route.from === toId && route.to === fromId),
  );
}

export function getLocationPositionAu(params: {
  locationId: string;
  day: number;
  locations: Location[];
  orbitalBodies: OrbitalBody[];
}): CoordinateAu | null {
  const { locationId, day, locations, orbitalBodies } = params;
  const location = locations.find((entry) => entry.id === locationId);

  if (!location?.orbitalBodyId) {
    return null;
  }

  const bodyMap = getOrbitalBodyMap(orbitalBodies);
  const body = bodyMap.get(location.orbitalBodyId);

  if (!body) {
    return null;
  }

  return getOrbitalPositionAu(body, day, bodyMap);
}

export function getTravelMetricsFromPoints(params: {
  originPosition: CoordinateAu;
  destinationPosition: CoordinateAu;
  settings: GlobalSettings;
}): { distanceAu: number; travelTimeDays: number } {
  const { originPosition, destinationPosition, settings } = params;
  const distanceAu = getDistanceAu(originPosition, destinationPosition);

  return {
    distanceAu,
    travelTimeDays: distanceAu / settings.shipSpeedAuPerDay,
  };
}

export function getTravelMetrics(params: {
  originId: string;
  destinationId: string;
  day: number;
  settings: GlobalSettings;
  locations: Location[];
  orbitalBodies: OrbitalBody[];
}): { distanceAu: number; travelTimeDays: number } | null {
  const { originId, destinationId, day, settings, locations, orbitalBodies } = params;
  const originPosition = getLocationPositionAu({
    locationId: originId,
    day,
    locations,
    orbitalBodies,
  });
  const destinationPosition = getLocationPositionAu({
    locationId: destinationId,
    day,
    locations,
    orbitalBodies,
  });

  if (!originPosition || !destinationPosition) {
    return null;
  }

  return getTravelMetricsFromPoints({
    originPosition,
    destinationPosition,
    settings,
  });
}

export function estimateTrade(params: {
  originId: string;
  destinationId: string;
  goodId: string;
  quantity: number;
  day: number;
  settings: GlobalSettings;
  goods: GoodDefinition[];
  locations: Location[];
  routes: RouteDefinition[];
  orbitalBodies: OrbitalBody[];
}): TradeEstimate | null {
  const {
    originId,
    destinationId,
    goodId,
    quantity,
    day,
    settings,
    goods,
    locations,
    routes,
    orbitalBodies,
  } = params;

  const origin = locations.find((location) => location.id === originId);
  const destination = locations.find((location) => location.id === destinationId);
  const good = goods.find((entry) => entry.id === goodId);

  if (!origin || !destination || !good || !origin.orbitalBodyId || !destination.orbitalBodyId) {
    return null;
  }

  const buyPrice = getBuyPriceGp(origin, good);
  const sellPrice = getSellPriceGp(destination, good);

  if (buyPrice === null || sellPrice === null) {
    return null;
  }

  const originPosition = getLocationPositionAu({
    locationId: originId,
    day,
    locations,
    orbitalBodies,
  });
  const destinationPosition = getLocationPositionAu({
    locationId: destinationId,
    day,
    locations,
    orbitalBodies,
  });

  if (!originPosition || !destinationPosition) {
    return null;
  }

  const { distanceAu, travelTimeDays } = getTravelMetricsFromPoints({
    originPosition,
    destinationPosition,
    settings,
  });
  const purchaseCostGp = buyPrice * quantity;
  const saleValueGp = sellPrice * quantity;
  const netProfitGp = saleValueGp - purchaseCostGp;

  if (netProfitGp <= 0) {
    return null;
  }

  return {
    originId,
    destinationId,
    goodId,
    quantity,
    purchaseCostGp,
    saleValueGp,
    netProfitGp,
    profitPerDayGp: netProfitGp / Math.max(travelTimeDays, 0.1),
    profitPerAuGp: netProfitGp / Math.max(distanceAu, 0.1),
    distanceAu,
    travelTimeDays,
    route: findRouteDefinition(routes, originId, destinationId),
  };
}

export function buildRouteComparisons(params: {
  quantity: number;
  day: number;
  settings: GlobalSettings;
  goods: GoodDefinition[];
  locations: Location[];
  routes: RouteDefinition[];
  orbitalBodies: OrbitalBody[];
  filters: RouteComparisonFilters;
}): TradeEstimate[] {
  const { quantity, day, settings, goods, locations, routes, orbitalBodies, filters } = params;

  const candidates: TradeEstimate[] = [];
  const tradeLocations = locations.filter((location) => location.market.length > 0);

  for (const origin of tradeLocations) {
    for (const destination of tradeLocations) {
      if (origin.id === destination.id) {
        continue;
      }

      if (filters.originId !== "all" && origin.id !== filters.originId) {
        continue;
      }

      if (filters.destinationId !== "all" && destination.id !== filters.destinationId) {
        continue;
      }

      for (const good of goods) {
        if (filters.category !== "all" && good.category !== filters.category) {
          continue;
        }

        const estimate = estimateTrade({
          originId: origin.id,
          destinationId: destination.id,
          goodId: good.id,
          quantity,
          day,
          settings,
          goods,
          locations,
          routes,
          orbitalBodies,
        });

        if (estimate) {
          candidates.push(estimate);
        }
      }
    }
  }

  const sorted = candidates.sort((left, right) => {
    if (filters.sortBy === "netProfit") {
      return right.netProfitGp - left.netProfitGp;
    }

    if (filters.sortBy === "profitPerAu") {
      return right.profitPerAuGp - left.profitPerAuGp;
    }

    return right.profitPerDayGp - left.profitPerDayGp;
  });

  return sorted;
}
