import type { GoodDefinition, Location, TradeEstimate } from "../types/economy";
import { formatGp, titleCaseSupply } from "../utils/format";
import { getBuyPriceGp, getSellPriceGp } from "../utils/trade";

interface LocationPanelProps {
  location: Location;
  goods: GoodDefinition[];
  destinationLocation?: Location;
  profitableToDestination: TradeEstimate[];
  onChooseGood: (goodId: string) => void;
}

export function LocationPanel(props: LocationPanelProps): JSX.Element {
  const {
    location,
    goods,
    destinationLocation,
    profitableToDestination,
    onChooseGood,
  } = props;

  const marketRows = location.market
    .map((entry) => {
      const good = goods.find((item) => item.id === entry.goodId);
      if (!good) {
        return null;
      }

      return {
        good,
        buyPrice: getBuyPriceGp(location, good),
        sellPrice: getSellPriceGp(location, good),
        supply: entry.supply,
        demand: entry.demand,
        notes: entry.notes,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((left, right) => left.good.name.localeCompare(right.good.name));

  return (
    <section className="panel location-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Selected Location</p>
          <h2>{location.name}</h2>
        </div>
      </div>

      <p className="location-summary">{location.shortDescription}</p>
      <p className="location-description">{location.description}</p>

      <div className="meta-grid">
        {location.primarySettlement && (
          <div className="meta-card">
            <span className="meta-label">Primary Point</span>
            <strong>{location.primarySettlement}</strong>
          </div>
        )}
        {location.population && (
          <div className="meta-card">
            <span className="meta-label">Population</span>
            <strong>{location.population}</strong>
          </div>
        )}
        {location.currency && (
          <div className="meta-card">
            <span className="meta-label">Currency</span>
            <strong>{location.currency}</strong>
          </div>
        )}
      </div>

      <div className="info-columns">
        <div>
          <h3>Produces / Sells</h3>
          <ul className="detail-list">
            {location.produces.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Wants / Pays For</h3>
          <ul className="detail-list">
            {location.demands.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="info-columns">
        <div>
          <h3>Bonuses</h3>
          <ul className="detail-list">
            {location.bonuses.map((bonus) => (
              <li key={bonus.label}>
                <strong>{bonus.label}.</strong> {bonus.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Rules / Constraints</h3>
          <ul className="detail-list">
            {location.rules.map((rule) => (
              <li key={rule.label}>
                <strong>{rule.label}.</strong> {rule.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3>Trade Snapshot</h3>
        {marketRows.length === 0 ? (
          <p className="support-copy">
            This node is shown primarily for navigation or context. It does not have a normal cargo market in phase 1.
          </p>
        ) : (
          <div className="table-scroll">
            <table className="market-table">
              <thead>
                <tr>
                  <th>Good</th>
                  <th>Buy Here</th>
                  <th>Sell Here</th>
                  <th>Supply</th>
                  <th>Demand</th>
                </tr>
              </thead>
              <tbody>
                {marketRows.map((row) => (
                  <tr key={row.good.id} title={row.notes}>
                    <td>
                      <strong>{row.good.name}</strong>
                      <span className="table-subtext">per ton</span>
                    </td>
                    <td>{row.buyPrice ? formatGp(row.buyPrice) : "—"}</td>
                    <td>{row.sellPrice ? formatGp(row.sellPrice) : "—"}</td>
                    <td>{titleCaseSupply(row.supply)}</td>
                    <td>{titleCaseSupply(row.demand)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3>
          Profitable To {destinationLocation ? destinationLocation.name : "Destination"}
        </h3>
        {location.market.length === 0 ? (
          <p className="support-copy">
            This location does not have a seeded cargo market, so there is nothing to compare for route profit yet.
          </p>
        ) : !destinationLocation || destinationLocation.id === location.id ? (
          <p className="support-copy">
            Pick a different destination to see which goods from {location.name} sell for profit there.
          </p>
        ) : profitableToDestination.length === 0 ? (
          <p className="support-copy">
            No seeded cargo from {location.name} currently sells above purchase price at {destinationLocation.name}.
          </p>
        ) : (
          <div className="table-scroll">
            <table className="market-table compact-table">
              <thead>
                <tr>
                  <th>Good</th>
                  <th>Buy Here</th>
                  <th>Sell There</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {profitableToDestination.slice(0, 6).map((route) => {
                  const good = goods.find((item) => item.id === route.goodId);
                  return (
                  <tr
                    key={`${location.id}-${destinationLocation.id}-${route.goodId}`}
                    onClick={() => onChooseGood(route.goodId)}
                  >
                      <td>{good?.name ?? route.goodId}</td>
                      <td>{formatGp(route.purchaseCostGp / route.quantity)}</td>
                      <td>{formatGp(route.saleValueGp / route.quantity)}</td>
                      <td>{formatGp(route.netProfitGp / route.quantity)}</td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {location.notes.length > 0 && (
        <div>
          <h3>Notes</h3>
          <ul className="detail-list">
            {location.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
