import { useEffect, useMemo, useState } from "react";
import { CargoHoldPanel } from "./components/CargoHoldPanel";
import { LegendPanel } from "./components/LegendPanel";
import { LocationPanel } from "./components/LocationPanel";
import { SystemMap } from "./components/SystemMap";
import { TradeCalculator } from "./components/TradeCalculator";
import { goods } from "./data/goods";
import { locations } from "./data/locations";
import { routes } from "./data/routes";
import { globalSettings, orbitalBodies } from "./data/settings";
import type { CoordinateAu, GoodDefinition, ShipState } from "./types/economy";
import { buildRouteMarkdown } from "./utils/export";
import { formatAu, formatDays, formatTons } from "./utils/format";
import {
  buildRouteComparisons,
  estimateTrade,
  getBuyPriceGp,
  getLocationPositionAu,
  getSellPriceGp,
  getTravelMetricsFromPoints,
} from "./utils/trade";

interface SimulationSnapshot {
  day: number;
  ship: ShipState;
}

function moveTowardsPoint(
  start: CoordinateAu,
  destination: CoordinateAu,
  maxDistance: number,
): { position: CoordinateAu; arrived: boolean } {
  const dx = destination.x - start.x;
  const dy = destination.y - start.y;
  const distance = Math.hypot(dx, dy);

  if (distance <= maxDistance) {
    return {
      position: destination,
      arrived: true,
    };
  }

  const ratio = maxDistance / distance;

  return {
    position: {
      x: start.x + dx * ratio,
      y: start.y + dy * ratio,
    },
    arrived: false,
  };
}

function getLocationName(locationId: string): string {
  return locations.find((location) => location.id === locationId)?.name ?? locationId;
}

function getGoodById(goodId: string): GoodDefinition | undefined {
  return goods.find((good) => good.id === goodId);
}

function createCargoId(goodId: string): string {
  return `${goodId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildInitialShipState(): ShipState {
  const initialPosition =
    getLocationPositionAu({
      locationId: "rock_of_bral",
      day: globalSettings.timeModel.currentDay,
      locations,
      orbitalBodies,
    }) ?? { x: 0, y: 0 };

  return {
    originId: "rock_of_bral",
    destinationId: "qesh",
    status: "docked",
    positionAu: initialPosition,
    cargo: [],
  };
}

function trimSnapshotsThroughDay(
  snapshots: Record<number, SimulationSnapshot>,
  maxDay: number,
): Record<number, SimulationSnapshot> {
  return Object.fromEntries(
    Object.entries(snapshots).filter(([day]) => Number(day) <= maxDay),
  );
}

function simulateNextDay(
  current: SimulationSnapshot,
): { nextSimulation: SimulationSnapshot; arrivedLocationId: string | null } {
  const nextDay = current.day + 1;
  const nextShip = current.ship;

  const nextOriginPosition =
    getLocationPositionAu({
      locationId: nextShip.originId,
      day: nextDay,
      locations,
      orbitalBodies,
    }) ?? nextShip.positionAu;
  const nextDestinationPosition =
    getLocationPositionAu({
      locationId: nextShip.destinationId,
      day: nextDay,
      locations,
      orbitalBodies,
    }) ?? nextShip.positionAu;

  if (nextShip.status === "docked" && nextShip.destinationId === nextShip.originId) {
    return {
      nextSimulation: {
        day: nextDay,
        ship: {
          ...nextShip,
          positionAu: nextOriginPosition,
        },
      },
      arrivedLocationId: null,
    };
  }

  const travelStep = moveTowardsPoint(
    nextShip.positionAu,
    nextDestinationPosition,
    globalSettings.shipSpeedAuPerDay,
  );

  if (travelStep.arrived) {
    return {
      nextSimulation: {
        day: nextDay,
        ship: {
          ...nextShip,
          originId: nextShip.destinationId,
          positionAu: nextDestinationPosition,
          status: "docked",
        },
      },
      arrivedLocationId: nextShip.destinationId,
    };
  }

  return {
    nextSimulation: {
      day: nextDay,
      ship: {
        ...nextShip,
        positionAu: travelStep.position,
        status: "in_transit",
      },
    },
    arrivedLocationId: null,
  };
}

function App(): JSX.Element {
  const initialSimulation = useMemo<SimulationSnapshot>(
    () => ({
      day: globalSettings.timeModel.currentDay,
      ship: buildInitialShipState(),
    }),
    [],
  );
  const [selectedLocationId, setSelectedLocationId] = useState("rock_of_bral");
  const [selectedGoodId, setSelectedGoodId] = useState("metal_tools");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [dayInput, setDayInput] = useState(String(initialSimulation.day));
  const [simulation, setSimulation] = useState<SimulationSnapshot>(initialSimulation);
  const [daySnapshots, setDaySnapshots] = useState<Record<number, SimulationSnapshot>>({
    [initialSimulation.day]: initialSimulation,
  });

  useEffect(() => {
    setDayInput(String(simulation.day));
  }, [simulation.day]);

  const daysInSystem = simulation.day;
  const ship = simulation.ship;

  const selectedLocation =
    locations.find((location) => location.id === selectedLocationId) ?? locations[0];
  const originLocation = locations.find((location) => location.id === ship.originId);
  const destinationLocation = locations.find((location) => location.id === ship.destinationId);
  const currentDockedLocation =
    ship.status === "docked" ? originLocation : undefined;

  const usedCapacityTons = ship.cargo.reduce(
    (total, cargo) => total + cargo.quantityTons,
    0,
  );
  const remainingCapacityTons = Math.max(
    0,
    globalSettings.shipCargoCapacityTons - usedCapacityTons,
  );
  const suggestionTons = Math.max(1, remainingCapacityTons);

  const destinationPosition =
    destinationLocation
      ? getLocationPositionAu({
          locationId: destinationLocation.id,
          day: daysInSystem,
          locations,
          orbitalBodies,
        })
      : null;

  const currentRouteTravel =
    destinationPosition && ship.destinationId !== ship.originId
      ? getTravelMetricsFromPoints({
          originPosition: ship.positionAu,
          destinationPosition,
          settings: globalSettings,
        })
      : null;

  const routeSuggestions =
    originLocation &&
    destinationLocation &&
    originLocation.market.length > 0 &&
    destinationLocation.market.length > 0 &&
    originLocation.id !== destinationLocation.id
      ? buildRouteComparisons({
          quantity: suggestionTons,
          day: daysInSystem,
          settings: globalSettings,
          goods,
          locations,
          routes,
          orbitalBodies,
          filters: {
            originId: originLocation.id,
            destinationId: destinationLocation.id,
            category: "all",
            sortBy: "profitPerDay",
          },
        })
      : [];

  const estimate =
    originLocation &&
    destinationLocation &&
    originLocation.market.length > 0 &&
    destinationLocation.market.length > 0 &&
    originLocation.id !== destinationLocation.id
      ? estimateTrade({
          originId: originLocation.id,
          destinationId: destinationLocation.id,
          goodId: selectedGoodId,
          quantity: suggestionTons,
          day: daysInSystem,
          settings: globalSettings,
          goods,
          locations,
          routes,
          orbitalBodies,
        })
      : null;

  const selectedLocationSuggestions =
    destinationLocation &&
    selectedLocation.market.length > 0 &&
    destinationLocation.market.length > 0 &&
    selectedLocation.id !== destinationLocation.id
      ? buildRouteComparisons({
          quantity: suggestionTons,
          day: daysInSystem,
          settings: globalSettings,
          goods,
          locations,
          routes,
          orbitalBodies,
          filters: {
            originId: selectedLocation.id,
            destinationId: destinationLocation.id,
            category: "all",
            sortBy: "profitPerDay",
          },
        })
      : [];

  const availableCargoRows = useMemo(() => {
    if (!currentDockedLocation) {
      return [];
    }

    return currentDockedLocation.market
      .map((entry) => {
        const good = getGoodById(entry.goodId);

        if (!good) {
          return null;
        }

        const buyPriceGp = getBuyPriceGp(currentDockedLocation, good);

        if (buyPriceGp === null) {
          return null;
        }

        const projectedSellPriceGp = destinationLocation
          ? getSellPriceGp(destinationLocation, good)
          : null;

        return {
          good,
          buyPriceGp,
          projectedSellPriceGp,
          projectedProfitPerTonGp:
            projectedSellPriceGp === null ? null : projectedSellPriceGp - buyPriceGp,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort(
        (left, right) =>
          (right.projectedProfitPerTonGp ?? Number.NEGATIVE_INFINITY) -
          (left.projectedProfitPerTonGp ?? Number.NEGATIVE_INFINITY),
      );
  }, [currentDockedLocation, destinationLocation]);

  const manifestRows = useMemo(() => {
    return ship.cargo.map((cargo) => {
      const good = getGoodById(cargo.goodId);

      if (!good) {
        return null;
      }

      const currentSellPriceGp =
        currentDockedLocation ? getSellPriceGp(currentDockedLocation, good) : null;
      const projectedSellPriceGp =
        destinationLocation ? getSellPriceGp(destinationLocation, good) : null;

      return {
        cargo,
        good,
        loadedAtLabel: getLocationName(cargo.loadedAtLocationId),
        currentSellPriceGp,
        projectedSellPriceGp,
        projectedNetProfitGp:
          projectedSellPriceGp === null
            ? null
            : projectedSellPriceGp * cargo.quantityTons -
              cargo.purchasePricePerTonGp * cargo.quantityTons,
      };
    }).filter((row): row is NonNullable<typeof row> => row !== null);
  }, [currentDockedLocation, destinationLocation, ship.cargo]);

  const purchaseTotalGp = manifestRows.reduce(
    (total, row) =>
      total + row.cargo.purchasePricePerTonGp * row.cargo.quantityTons,
    0,
  );
  const projectedSaleTotalGp = manifestRows.reduce(
    (total, row) =>
      total + (row.projectedSellPriceGp ?? 0) * row.cargo.quantityTons,
    0,
  );
  const projectedProfitTotalGp = projectedSaleTotalGp - purchaseTotalGp;

  const markdownExport = buildRouteMarkdown({
    day: daysInSystem,
    status: ship.status === "docked" ? "Docked" : "In Transit",
    origin: originLocation,
    destination: destinationLocation,
    usedCapacityTons,
    totalCapacityTons: globalSettings.shipCargoCapacityTons,
    remainingDistanceAu: currentRouteTravel?.distanceAu ?? null,
    remainingTravelTimeDays: currentRouteTravel?.travelTimeDays ?? null,
    purchaseCostGp: purchaseTotalGp,
    projectedSaleValueGp: projectedSaleTotalGp,
    projectedProfitGp: projectedProfitTotalGp,
    cargoRows: manifestRows.map((row) => ({
      cargo: row.cargo,
      good: row.good,
      loadedAtLabel: row.loadedAtLabel,
      projectedSaleValueGp:
        row.projectedSellPriceGp === null
          ? null
          : row.projectedSellPriceGp * row.cargo.quantityTons,
      projectedNetProfitGp: row.projectedNetProfitGp,
    })),
  });

  function handleSelectLocation(locationId: string): void {
    setSelectedLocationId(locationId);
  }

  function handleDestinationChange(locationId: string): void {
    const nextSimulation = {
      ...simulation,
      ship: {
        ...simulation.ship,
        destinationId: locationId,
      },
    };

    setSimulation(nextSimulation);
    setDaySnapshots((current) => ({
      ...trimSnapshotsThroughDay(current, simulation.day),
      [nextSimulation.day]: nextSimulation,
    }));
  }

  function advanceSimulation(daysToAdvance: number): void {
    let nextSimulation = simulation;
    let nextSnapshots = trimSnapshotsThroughDay(daySnapshots, simulation.day);
    let arrivedLocationId: string | null = null;

    for (let index = 0; index < daysToAdvance; index += 1) {
      const result = simulateNextDay(nextSimulation);
      nextSimulation = result.nextSimulation;
      nextSnapshots = {
        ...nextSnapshots,
        [nextSimulation.day]: nextSimulation,
      };

      if (result.arrivedLocationId) {
        arrivedLocationId = result.arrivedLocationId;
      }
    }

    setSimulation(nextSimulation);
    setDaySnapshots(nextSnapshots);

    if (arrivedLocationId) {
      setSelectedLocationId(arrivedLocationId);
    }
  }

  function rewindSimulationOneDay(): void {
    const previousDay = simulation.day - 1;

    if (previousDay < globalSettings.timeModel.minDay) {
      return;
    }

    const previousSnapshot = daySnapshots[previousDay];

    if (!previousSnapshot) {
      return;
    }

    setSimulation(previousSnapshot);
    setSelectedLocationId(previousSnapshot.ship.originId);
  }

  function handleSetSimulationDay(): void {
    const parsedDay = Number(dayInput);
    const targetDay = Math.max(
      globalSettings.timeModel.minDay,
      Math.min(globalSettings.timeModel.maxDay, Number.isFinite(parsedDay) ? parsedDay : simulation.day),
    );

    if (targetDay === simulation.day) {
      if (simulation.ship.status === "docked") {
        const anchoredPosition =
          getLocationPositionAu({
            locationId: simulation.ship.originId,
            day: targetDay,
            locations,
            orbitalBodies,
          }) ?? simulation.ship.positionAu;

        const nextSimulation = {
          ...simulation,
          ship: {
            ...simulation.ship,
            positionAu: anchoredPosition,
          },
        };

        setSimulation(nextSimulation);
        setDaySnapshots((current) => ({
          ...trimSnapshotsThroughDay(current, targetDay),
          [targetDay]: nextSimulation,
        }));
      }
      return;
    }

    if (targetDay < simulation.day) {
      const previousSnapshot = daySnapshots[targetDay];

      if (!previousSnapshot) {
        return;
      }

      setSimulation(previousSnapshot);
      setSelectedLocationId(previousSnapshot.ship.originId);
      return;
    }

    let nextSimulation = simulation;
    let nextSnapshots = trimSnapshotsThroughDay(daySnapshots, simulation.day);
    let arrivedLocationId: string | null = null;

    while (nextSimulation.day < targetDay) {
      const result = simulateNextDay(nextSimulation);
      nextSimulation = result.nextSimulation;
      nextSnapshots = {
        ...nextSnapshots,
        [nextSimulation.day]: nextSimulation,
      };

      if (result.arrivedLocationId) {
        arrivedLocationId = result.arrivedLocationId;
      }
    }

    setSimulation(nextSimulation);
    setDaySnapshots(nextSnapshots);

    if (arrivedLocationId) {
      setSelectedLocationId(arrivedLocationId);
    }
  }

  function handleManualOriginChange(locationId: string): void {
    const anchoredPosition =
      getLocationPositionAu({
        locationId,
        day: simulation.day,
        locations,
        orbitalBodies,
      }) ?? simulation.ship.positionAu;

    const nextSimulation = {
      ...simulation,
      ship: {
        ...simulation.ship,
        originId: locationId,
        positionAu: anchoredPosition,
        status: "docked" as const,
      },
    };

    setSimulation(nextSimulation);
    setDaySnapshots((current) => ({
      ...trimSnapshotsThroughDay(current, simulation.day),
      [nextSimulation.day]: nextSimulation,
    }));
    setSelectedLocationId(locationId);
  }

  function handleLoadCargo(goodId: string, tons: number): void {
    if (!currentDockedLocation) {
      return;
    }

    const good = getGoodById(goodId);

    if (!good) {
      return;
    }

    const buyPriceGp = getBuyPriceGp(currentDockedLocation, good);

    if (buyPriceGp === null) {
      return;
    }

    const tonsToLoad = Math.max(0, Math.min(remainingCapacityTons, Math.floor(tons)));

    if (tonsToLoad <= 0) {
      return;
    }

    const existingCargo = simulation.ship.cargo.find(
      (cargo) =>
        cargo.goodId === goodId &&
        cargo.loadedAtLocationId === simulation.ship.originId &&
        cargo.purchasePricePerTonGp === buyPriceGp,
    );

    const nextCargo = existingCargo
      ? simulation.ship.cargo.map((cargo) =>
          cargo.id === existingCargo.id
            ? {
                ...cargo,
                quantityTons: cargo.quantityTons + tonsToLoad,
              }
            : cargo,
        )
      : [
          ...simulation.ship.cargo,
          {
            id: createCargoId(goodId),
            goodId,
            quantityTons: tonsToLoad,
            loadedAtLocationId: simulation.ship.originId,
            purchasePricePerTonGp: buyPriceGp,
          },
        ];

    const nextSimulation = {
      ...simulation,
      ship: {
        ...simulation.ship,
        cargo: nextCargo,
      },
    };

    setSimulation(nextSimulation);
    setDaySnapshots((current) => ({
      ...trimSnapshotsThroughDay(current, simulation.day),
      [nextSimulation.day]: nextSimulation,
    }));
  }

  function handleSellCargo(cargoId: string): void {
    if (!currentDockedLocation) {
      return;
    }

    const nextSimulation = {
      ...simulation,
      ship: {
        ...simulation.ship,
        cargo: simulation.ship.cargo.filter((cargo) => {
          if (cargo.id !== cargoId) {
            return true;
          }

          const good = getGoodById(cargo.goodId);

          if (!good) {
            return true;
          }

          return getSellPriceGp(currentDockedLocation, good) === null;
        }),
      },
    };

    setSimulation(nextSimulation);
    setDaySnapshots((current) => ({
      ...trimSnapshotsThroughDay(current, simulation.day),
      [nextSimulation.day]: nextSimulation,
    }));
  }

  function handleSellAllCargo(): void {
    if (!currentDockedLocation) {
      return;
    }

    const nextSimulation = {
      ...simulation,
      ship: {
        ...simulation.ship,
        cargo: simulation.ship.cargo.filter((cargo) => {
          const good = getGoodById(cargo.goodId);

          if (!good) {
            return true;
          }

          return getSellPriceGp(currentDockedLocation, good) === null;
        }),
      },
    };

    setSimulation(nextSimulation);
    setDaySnapshots((current) => ({
      ...trimSnapshotsThroughDay(current, simulation.day),
      [nextSimulation.day]: nextSimulation,
    }));
  }

  function handleClearCargo(): void {
    const nextSimulation = {
      ...simulation,
      ship: {
        ...simulation.ship,
        cargo: [],
      },
    };

    setSimulation(nextSimulation);
    setDaySnapshots((current) => ({
      ...trimSnapshotsThroughDay(current, simulation.day),
      [nextSimulation.day]: nextSimulation,
    }));
  }

  async function handleCopyMarkdown(): Promise<void> {
    try {
      await navigator.clipboard.writeText(markdownExport);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus(null), 1800);
    } catch {
      setCopyStatus("Copy failed");
      window.setTimeout(() => setCopyStatus(null), 1800);
    }
  }

  function handleDownloadMarkdown(): void {
    const blob = new Blob([markdownExport], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stardust-route-day-${daysInSystem}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Spelljammer Trade Tool</p>
          <h1>Tashara Trade Visualizer</h1>
          <p className="hero-description">
            Step the system forward one day at a time, watch Bral and the Stardust move, then load cargo in tons for the most profitable haul.
          </p>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric">
            <span className="meta-label">Days In System</span>
            <strong>{daysInSystem}</strong>
          </div>
          <div className="hero-metric">
            <span className="meta-label">Ship Pace</span>
            <strong>{globalSettings.shipSpeedAuPerDay} AU / day</strong>
          </div>
          <div className="hero-metric">
            <span className="meta-label">Cargo Hold</span>
            <strong>{formatTons(globalSettings.shipCargoCapacityTons)}</strong>
          </div>
        </div>
      </header>

      <div className="top-focus-grid">
        <section className="panel map-panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">System View</p>
              <h2>Current Orbital Snapshot</h2>
            </div>
          </div>
          <SystemMap
            globalSettings={globalSettings}
            orbitalBodies={orbitalBodies}
            locations={locations}
            currentDay={daysInSystem}
            selectedLocationId={selectedLocationId}
            destinationId={ship.destinationId}
            stardustPositionAu={ship.positionAu}
            shipStatus={ship.status}
            onSelectLocation={handleSelectLocation}
          />
        </section>

        <div className="top-side-stack">
          <section className="panel orbit-controls-panel">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">Time And Ship</p>
                <h2>Stardust Route Control</h2>
              </div>
            </div>

            <label>
              <span>Simulation Day</span>
              <input
                type="number"
                min={globalSettings.timeModel.minDay}
                max={globalSettings.timeModel.maxDay}
                step={1}
                value={dayInput}
                onChange={(event) => setDayInput(event.target.value)}
              />
            </label>

            <label>
              <span>Current Origin Override</span>
              <select
                value={ship.originId}
                onChange={(event) => handleManualOriginChange(event.target.value)}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Destination</span>
              <select
                value={ship.destinationId}
                onChange={(event) => handleDestinationChange(event.target.value)}
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="metric-grid compact-metric-grid">
              <div className="metric-card">
                <span className="meta-label">Status</span>
                <strong>{ship.status === "docked" ? "Docked" : "In Transit"}</strong>
              </div>
              <div className="metric-card">
                <span className="meta-label">Current Origin</span>
                <strong>{originLocation?.name ?? "Unknown"}</strong>
              </div>
              <div className="metric-card">
                <span className="meta-label">Selected Destination</span>
                <strong>{destinationLocation?.name ?? "Not set"}</strong>
              </div>
              <div className="metric-card">
                <span className="meta-label">Remaining Distance</span>
                <strong>
                  {currentRouteTravel ? formatAu(currentRouteTravel.distanceAu) : "—"}
                </strong>
              </div>
              <div className="metric-card">
                <span className="meta-label">Remaining Travel</span>
                <strong>
                  {currentRouteTravel
                    ? formatDays(currentRouteTravel.travelTimeDays)
                    : "—"}
                </strong>
              </div>
              <div className="metric-card">
                <span className="meta-label">Cargo Onboard</span>
                <strong>{formatTons(usedCapacityTons)}</strong>
              </div>
            </div>

            <div className="panel-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleSetSimulationDay}
              >
                Set Day
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={rewindSimulationOneDay}
                disabled={simulation.day <= globalSettings.timeModel.minDay}
              >
                Back 1 Day
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => advanceSimulation(1)}
              >
                Advance 1 Day
              </button>
            </div>

            <p className="support-copy">
              Use Set Day to jump the simulation directly, Back 1 Day to rewind to the previous stored day, and Current Origin Override to manually re-dock the Stardust onto a chosen body at the current day.
            </p>
          </section>
          <LegendPanel />
        </div>
      </div>

      <div className="lower-grid focused-grid">
        <LocationPanel
          location={selectedLocation}
          goods={goods}
          destinationLocation={destinationLocation}
          profitableToDestination={selectedLocationSuggestions}
          onChooseGood={setSelectedGoodId}
        />
        <div className="right-side-stack">
          <TradeCalculator
            goods={goods}
            originLocation={originLocation}
            destinationLocation={destinationLocation}
            selectedGoodId={selectedGoodId}
            suggestionTons={suggestionTons}
            remainingCapacityTons={remainingCapacityTons}
            estimate={estimate}
            routeSuggestions={routeSuggestions}
            onGoodChange={setSelectedGoodId}
          />
          <CargoHoldPanel
            isDocked={ship.status === "docked"}
            originLocation={currentDockedLocation}
            destinationLocation={destinationLocation}
            usedCapacityTons={usedCapacityTons}
            remainingCapacityTons={remainingCapacityTons}
            holdCapacityTons={globalSettings.shipCargoCapacityTons}
            availableCargoRows={availableCargoRows}
            manifestRows={manifestRows}
            purchaseTotalGp={purchaseTotalGp}
            projectedSaleTotalGp={projectedSaleTotalGp}
            projectedProfitTotalGp={projectedProfitTotalGp}
            markdownExport={markdownExport}
            copyStatus={copyStatus}
            onLoadCargo={handleLoadCargo}
            onSellCargo={handleSellCargo}
            onSellAllCargo={handleSellAllCargo}
            onClearCargo={handleClearCargo}
            onCopyMarkdown={handleCopyMarkdown}
            onDownloadMarkdown={handleDownloadMarkdown}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
