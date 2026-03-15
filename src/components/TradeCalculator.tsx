import type { GoodDefinition, Location, TradeEstimate } from "../types/economy";
import { formatAu, formatDays, formatGp, formatTons } from "../utils/format";

interface TradeCalculatorProps {
  goods: GoodDefinition[];
  originLocation?: Location;
  destinationLocation?: Location;
  selectedGoodId: string;
  suggestionTons: number;
  remainingCapacityTons: number;
  estimate: TradeEstimate | null;
  routeSuggestions: TradeEstimate[];
  onGoodChange: (goodId: string) => void;
}

export function TradeCalculator(props: TradeCalculatorProps): JSX.Element {
  const {
    goods,
    originLocation,
    destinationLocation,
    selectedGoodId,
    suggestionTons,
    remainingCapacityTons,
    estimate,
    routeSuggestions,
    onGoodChange,
  } = props;

  const selectedGood = goods.find((good) => good.id === selectedGoodId);

  return (
    <section className="panel calculator-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Route Planner</p>
          <h2>Best Cargo For This Route</h2>
        </div>
      </div>

      <p className="support-copy">
        {originLocation && destinationLocation && originLocation.id !== destinationLocation.id
          ? `These suggestions assume you buy at ${originLocation.name} and sell at ${destinationLocation.name}. Profits below are shown for ${formatTons(suggestionTons)} so you can see what best fills the remaining hold.`
          : "Choose a destination in the Time And Ship panel to see which cargo from the current origin is worth hauling."}
      </p>

      <div className="metric-grid compact-metric-grid route-overview-grid">
        <div className="metric-card">
          <span className="meta-label">Current Origin</span>
          <strong>{originLocation?.name ?? "Unknown"}</strong>
        </div>
        <div className="metric-card">
          <span className="meta-label">Current Destination</span>
          <strong>{destinationLocation?.name ?? "Not set"}</strong>
        </div>
        <div className="metric-card">
          <span className="meta-label">Remaining Hold</span>
          <strong>{formatTons(remainingCapacityTons)}</strong>
        </div>
        <div className="metric-card">
          <span className="meta-label">Planner Load</span>
          <strong>{formatTons(suggestionTons)}</strong>
        </div>
      </div>

      {routeSuggestions.length > 0 ? (
        <div className="route-notes">
          <h3>Most Profitable Cargo For This Route</h3>
          <div className="table-scroll">
            <table className="market-table compact-table route-cargo-table">
              <thead>
                <tr>
                  <th>Good</th>
                  <th>Buy / ton</th>
                  <th>Sell / ton</th>
                  <th>Route Profit</th>
                  <th>Profit / ton</th>
                  <th>Travel Time</th>
                </tr>
              </thead>
              <tbody>
                {routeSuggestions.slice(0, 8).map((suggestion) => {
                  const good = goods.find((entry) => entry.id === suggestion.goodId);
                  const perTonBuy = suggestion.purchaseCostGp / suggestion.quantity;
                  const perTonSell = suggestion.saleValueGp / suggestion.quantity;
                  const perTonProfit = suggestion.netProfitGp / suggestion.quantity;

                  return (
                    <tr key={suggestion.goodId} onClick={() => onGoodChange(suggestion.goodId)}>
                      <td>{good?.name ?? suggestion.goodId}</td>
                      <td>{formatGp(perTonBuy)}</td>
                      <td>{formatGp(perTonSell)}</td>
                      <td>{formatGp(suggestion.netProfitGp)}</td>
                      <td>{formatGp(perTonProfit)}</td>
                      <td>{formatDays(suggestion.travelTimeDays)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="route-notes">
          <h3>Most Profitable Cargo For This Route</h3>
          <p className="support-copy">
            No profitable seeded cargo appears for this route right now.
          </p>
        </div>
      )}

      {estimate && selectedGood ? (
        <>
          <div className="route-notes">
            <h3>
              Selected Cargo: {selectedGood.name} for {formatTons(suggestionTons)}
            </h3>
          </div>

          <div className="metric-grid">
            <div className="metric-card">
              <span className="meta-label">Purchase Cost</span>
              <strong>{formatGp(estimate.purchaseCostGp)}</strong>
            </div>
            <div className="metric-card">
              <span className="meta-label">Sale Value</span>
              <strong>{formatGp(estimate.saleValueGp)}</strong>
            </div>
            <div className="metric-card">
              <span className="meta-label">Net Profit</span>
              <strong>{formatGp(estimate.netProfitGp)}</strong>
            </div>
            <div className="metric-card">
              <span className="meta-label">Distance</span>
              <strong>{formatAu(estimate.distanceAu)}</strong>
            </div>
            <div className="metric-card">
              <span className="meta-label">Travel Time</span>
              <strong>{formatDays(estimate.travelTimeDays)}</strong>
            </div>
            <div className="metric-card">
              <span className="meta-label">Profit / Day</span>
              <strong>{formatGp(estimate.profitPerDayGp)}</strong>
            </div>
            <div className="metric-card">
              <span className="meta-label">Profit / AU</span>
              <strong>{formatGp(estimate.profitPerAuGp)}</strong>
            </div>
            <div className="metric-card">
              <span className="meta-label">Route Risk</span>
              <strong>{estimate.route?.risk ?? "moderate"}</strong>
            </div>
          </div>

          {estimate.route && (
            <div className="route-notes">
              <h3>Matched Route Notes</h3>
              <ul className="detail-list">
                {estimate.route.travelNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="support-copy">
          Pick a destination with an active market to inspect the currently selected cargo in more detail.
        </p>
      )}
    </section>
  );
}
