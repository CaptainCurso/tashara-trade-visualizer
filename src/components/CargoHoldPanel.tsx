import { useMemo, useState } from "react";
import type { GoodDefinition, Location, ShipCargoEntry } from "../types/economy";
import { formatGp, formatTons } from "../utils/format";

interface AvailableCargoRow {
  good: GoodDefinition;
  buyPriceGp: number;
  projectedSellPriceGp: number | null;
  projectedProfitPerTonGp: number | null;
}

interface CargoManifestRow {
  cargo: ShipCargoEntry;
  good: GoodDefinition;
  loadedAtLabel: string;
  currentSellPriceGp: number | null;
  projectedSellPriceGp: number | null;
  projectedNetProfitGp: number | null;
}

interface CargoHoldPanelProps {
  isDocked: boolean;
  originLocation?: Location;
  destinationLocation?: Location;
  usedCapacityTons: number;
  remainingCapacityTons: number;
  holdCapacityTons: number;
  availableCargoRows: AvailableCargoRow[];
  manifestRows: CargoManifestRow[];
  purchaseTotalGp: number;
  projectedSaleTotalGp: number;
  projectedProfitTotalGp: number;
  markdownExport: string;
  copyStatus: string | null;
  onLoadCargo: (goodId: string, tons: number) => void;
  onSellCargo: (cargoId: string) => void;
  onSellAllCargo: () => void;
  onClearCargo: () => void;
  onCopyMarkdown: () => void;
  onDownloadMarkdown: () => void;
}

export function CargoHoldPanel(props: CargoHoldPanelProps): JSX.Element {
  const {
    isDocked,
    originLocation,
    destinationLocation,
    usedCapacityTons,
    remainingCapacityTons,
    holdCapacityTons,
    availableCargoRows,
    manifestRows,
    purchaseTotalGp,
    projectedSaleTotalGp,
    projectedProfitTotalGp,
    markdownExport,
    copyStatus,
    onLoadCargo,
    onSellCargo,
    onSellAllCargo,
    onClearCargo,
    onCopyMarkdown,
    onDownloadMarkdown,
  } = props;

  const [draftLoads, setDraftLoads] = useState<Record<string, string>>({});

  const sellableCargoCount = useMemo(
    () => manifestRows.filter((row) => row.currentSellPriceGp !== null).length,
    [manifestRows],
  );

  return (
    <section className="panel cargo-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Cargo Hold</p>
          <h2>Stardust Manifest</h2>
        </div>
        <div className="panel-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onSellAllCargo}
            disabled={!isDocked || sellableCargoCount === 0}
          >
            Sell All Sellable Here
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onClearCargo}
            disabled={manifestRows.length === 0}
          >
            Clear Cargo
          </button>
        </div>
      </div>

      <div className="metric-grid compact-metric-grid">
        <div className="metric-card">
          <span className="meta-label">Loaded Cargo</span>
          <strong>{formatTons(usedCapacityTons)}</strong>
        </div>
        <div className="metric-card">
          <span className="meta-label">Free Hold</span>
          <strong>{formatTons(remainingCapacityTons)}</strong>
        </div>
        <div className="metric-card">
          <span className="meta-label">Purchase Cost</span>
          <strong>{formatGp(purchaseTotalGp)}</strong>
        </div>
        <div className="metric-card">
          <span className="meta-label">Projected Profit</span>
          <strong>{formatGp(projectedProfitTotalGp)}</strong>
        </div>
      </div>

      <p className="support-copy">
        Hold capacity is fixed at {formatTons(holdCapacityTons)}. Cargo is bought in whole tons to keep table math simple for players.
      </p>

      <div className="route-notes">
        <h3>Loaded Cargo</h3>
        {manifestRows.length === 0 ? (
          <p className="support-copy">
            The Stardust is empty. Clear space intentionally for exploration, or load trade goods while docked.
          </p>
        ) : (
          <div className="table-scroll">
            <table className="market-table compact-table">
              <thead>
                <tr>
                  <th>Good</th>
                  <th>Tons</th>
                  <th>Bought At</th>
                  <th>Sell Here</th>
                  <th>Projected @ Destination</th>
                  <th>Projected Net</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {manifestRows.map((row) => (
                  <tr key={row.cargo.id}>
                    <td>{row.good.name}</td>
                    <td>{row.cargo.quantityTons.toFixed(1)}</td>
                    <td>{row.loadedAtLabel}</td>
                    <td>
                      {row.currentSellPriceGp === null
                        ? "—"
                        : formatGp(row.currentSellPriceGp * row.cargo.quantityTons)}
                    </td>
                    <td>
                      {row.projectedSellPriceGp === null
                        ? "—"
                        : formatGp(row.projectedSellPriceGp * row.cargo.quantityTons)}
                    </td>
                    <td>
                      {row.projectedNetProfitGp === null
                        ? "—"
                        : formatGp(row.projectedNetProfitGp)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="secondary-button row-button"
                        onClick={() => onSellCargo(row.cargo.id)}
                        disabled={!isDocked || row.currentSellPriceGp === null}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="route-notes">
        <h3>Load Cargo At Origin</h3>
        {!isDocked ? (
          <p className="support-copy">
            Loading is disabled while the Stardust is in transit. Advance time until arrival to trade again.
          </p>
        ) : !originLocation || availableCargoRows.length === 0 ? (
          <p className="support-copy">
            {originLocation?.name ?? "This location"} does not currently have seeded cargo for purchase.
          </p>
        ) : (
          <div className="table-scroll">
            <table className="market-table compact-table">
              <thead>
                <tr>
                  <th>Good</th>
                  <th>Buy / ton</th>
                  <th>Projected / ton</th>
                  <th>Net / ton</th>
                  <th>Tons To Load</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {availableCargoRows.map((row) => {
                  const draftValue = draftLoads[row.good.id] ?? "1";
                  const numericDraft = Number(draftValue);
                  const validTons =
                    Number.isFinite(numericDraft) && numericDraft > 0
                      ? numericDraft
                      : 0;

                  return (
                    <tr key={row.good.id}>
                      <td>{row.good.name}</td>
                      <td>{formatGp(row.buyPriceGp)}</td>
                      <td>
                        {row.projectedSellPriceGp === null
                          ? "—"
                          : formatGp(row.projectedSellPriceGp)}
                      </td>
                      <td>
                        {row.projectedProfitPerTonGp === null
                          ? "—"
                          : formatGp(row.projectedProfitPerTonGp)}
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          className="table-input"
                          value={draftValue}
                          onChange={(event) =>
                            setDraftLoads((current) => ({
                              ...current,
                              [row.good.id]: event.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="secondary-button row-button"
                          onClick={() => {
                            onLoadCargo(row.good.id, validTons);
                            setDraftLoads((current) => ({
                              ...current,
                              [row.good.id]: "1",
                            }));
                          }}
                          disabled={validTons <= 0 || remainingCapacityTons <= 0}
                        >
                          Load
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="route-notes">
        <div className="panel-header">
          <div>
            <p className="panel-eyebrow">Markdown Export</p>
            <h3>Route Share Sheet</h3>
          </div>
          <div className="panel-actions">
            <button type="button" className="secondary-button" onClick={onCopyMarkdown}>
              {copyStatus ?? "Copy Markdown"}
            </button>
            <button type="button" className="secondary-button" onClick={onDownloadMarkdown}>
              Download Markdown
            </button>
          </div>
        </div>
        <p className="support-copy">
          Export the current route plan with origin, destination, cargo, and projected profit in Markdown.
        </p>
        <textarea
          className="markdown-export"
          value={markdownExport}
          readOnly
          aria-label="Markdown export preview"
        />
      </div>
    </section>
  );
}
