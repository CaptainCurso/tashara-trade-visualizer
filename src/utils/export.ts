import type { GoodDefinition, Location, ShipCargoEntry } from "../types/economy";
import { formatAu, formatDays, formatGp, formatTons } from "./format";

interface CargoProjectionRow {
  cargo: ShipCargoEntry;
  good?: GoodDefinition;
  loadedAtLabel: string;
  projectedSaleValueGp?: number | null;
  projectedNetProfitGp?: number | null;
}

export function buildRouteMarkdown(params: {
  day: number;
  status: "Docked" | "In Transit";
  origin?: Location;
  destination?: Location;
  usedCapacityTons: number;
  totalCapacityTons: number;
  remainingDistanceAu?: number | null;
  remainingTravelTimeDays?: number | null;
  purchaseCostGp: number;
  projectedSaleValueGp: number;
  projectedProfitGp: number;
  cargoRows: CargoProjectionRow[];
}): string {
  const {
    day,
    status,
    origin,
    destination,
    usedCapacityTons,
    totalCapacityTons,
    remainingDistanceAu,
    remainingTravelTimeDays,
    purchaseCostGp,
    projectedSaleValueGp,
    projectedProfitGp,
    cargoRows,
  } = params;

  const headerLines = [
    "# Stardust Trade Plan",
    "",
    `- Day: ${day}`,
    `- Ship Status: ${status}`,
    `- Origin: ${origin?.name ?? "Unknown"}`,
    `- Destination: ${destination?.name ?? "Not set"}`,
    `- Cargo Loaded: ${formatTons(usedCapacityTons)} / ${formatTons(totalCapacityTons)}`,
  ];

  if (remainingDistanceAu !== null && remainingDistanceAu !== undefined) {
    headerLines.push(`- Remaining Distance: ${formatAu(remainingDistanceAu)}`);
  }

  if (remainingTravelTimeDays !== null && remainingTravelTimeDays !== undefined) {
    headerLines.push(`- Remaining Travel Time: ${formatDays(remainingTravelTimeDays)}`);
  }

  const cargoSection =
    cargoRows.length === 0
      ? ["", "## Cargo Manifest", "", "_No cargo loaded._"]
      : [
          "",
          "## Cargo Manifest",
          "",
          "| Good | Tons | Bought At | Cost | Projected Sale | Projected Net |",
          "| --- | ---: | --- | ---: | ---: | ---: |",
          ...cargoRows.map((row) => {
            const projectedSaleValue =
              row.projectedSaleValueGp === null || row.projectedSaleValueGp === undefined
                ? "—"
                : formatGp(row.projectedSaleValueGp);
            const projectedNet =
              row.projectedNetProfitGp === null || row.projectedNetProfitGp === undefined
                ? "—"
                : formatGp(row.projectedNetProfitGp);

            return `| ${row.good?.name ?? row.cargo.goodId} | ${row.cargo.quantityTons.toFixed(1)} | ${row.loadedAtLabel} | ${formatGp(row.cargo.purchasePricePerTonGp * row.cargo.quantityTons)} | ${projectedSaleValue} | ${projectedNet} |`;
          }),
        ];

  return [
    ...headerLines,
    "",
    "## Projection",
    "",
    `- Purchase Cost: ${formatGp(purchaseCostGp)}`,
    `- Projected Sale Value: ${formatGp(projectedSaleValueGp)}`,
    `- Projected Profit: ${formatGp(projectedProfitGp)}`,
    ...cargoSection,
  ].join("\n");
}
