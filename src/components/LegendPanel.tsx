export function LegendPanel(): JSX.Element {
  return (
    <section className="panel legend-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Legend</p>
          <h2>Map Reading</h2>
        </div>
      </div>

      <ul className="legend-list">
        <li>
          <span className="legend-swatch planet" />
          <span>Planet or trade world</span>
        </li>
        <li>
          <span className="legend-swatch bral" />
          <span>Rock of Bral</span>
        </li>
        <li>
          <span className="legend-swatch gate" />
          <span>Fixed sphere gate</span>
        </li>
        <li>
          <span className="legend-line orbit" />
          <span>Planetary orbit ring</span>
        </li>
        <li>
          <span className="legend-line bral-orbit-line" />
          <span>Bral hyperbolic transfer path</span>
        </li>
        <li>
          <span className="legend-line route" />
          <span>Currently selected route</span>
        </li>
      </ul>
    </section>
  );
}
