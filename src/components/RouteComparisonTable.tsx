import type { GoodDefinition, Location, TradeEstimate } from "../types/economy";
import { formatAu, formatDays, formatGp } from "../utils/format";

interface RouteComparisonTableProps {
  estimates: TradeEstimate[];
  goods: GoodDefinition[];
  locations: Location[];
  onPickRoute: (estimate: TradeEstimate) => void;
}

export function RouteComparisonTable(props: RouteComparisonTableProps): JSX.Element {
  const { estimates, goods, locations, onPickRoute } = props;

  const topRows = estimates.slice(0, 20);

  return (
    <section className="panel route-table-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Ranked Routes</p>
          <h2>Best Trade Options Right Now</h2>
        </div>
      </div>

      {topRows.length === 0 ? (
        <p className="support-copy">No routes match the current filters.</p>
      ) : (
        <div className="table-scroll">
          <table className="route-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Good</th>
                <th>Route</th>
                <th>Profit</th>
                <th>Per Day</th>
                <th>Per AU</th>
                <th>Distance</th>
                <th>Time</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {topRows.map((estimate, index) => {
                const good = goods.find((entry) => entry.id === estimate.goodId);
                const origin = locations.find((location) => location.id === estimate.originId);
                const destination = locations.find((location) => location.id === estimate.destinationId);

                return (
                  <tr key={`${estimate.originId}-${estimate.destinationId}-${estimate.goodId}`} onClick={() => onPickRoute(estimate)}>
                    <td>{index + 1}</td>
                    <td>{good?.name ?? estimate.goodId}</td>
                    <td>
                      <strong>{origin?.name ?? estimate.originId}</strong>
                      <span className="table-subtext">to {destination?.name ?? estimate.destinationId}</span>
                    </td>
                    <td>{formatGp(estimate.netProfitGp)}</td>
                    <td>{formatGp(estimate.profitPerDayGp)}</td>
                    <td>{formatGp(estimate.profitPerAuGp)}</td>
                    <td>{formatAu(estimate.distanceAu)}</td>
                    <td>{formatDays(estimate.travelTimeDays)}</td>
                    <td>{estimate.route?.risk ?? "moderate"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

