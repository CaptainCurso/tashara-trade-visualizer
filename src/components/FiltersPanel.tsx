import type { GoodCategory, Location, RouteComparisonFilters } from "../types/economy";

interface FiltersPanelProps {
  tradeLocations: Location[];
  filters: RouteComparisonFilters;
  onChange: (filters: RouteComparisonFilters) => void;
}

const categoryOptions: Array<{ value: GoodCategory | "all"; label: string }> = [
  { value: "all", label: "All cargo types" },
  { value: "food", label: "Food and staples" },
  { value: "textile", label: "Textiles" },
  { value: "material", label: "Raw materials" },
  { value: "technology", label: "Technology and tools" },
  { value: "knowledge", label: "Knowledge goods" },
  { value: "luxury", label: "Luxury goods" },
  { value: "biological", label: "Biological goods" },
  { value: "artifice", label: "Artifacts and advanced craft" },
];

export function FiltersPanel(props: FiltersPanelProps): JSX.Element {
  const { tradeLocations, filters, onChange } = props;

  return (
    <section className="panel filters-panel">
      <div className="panel-header">
        <div>
          <p className="panel-eyebrow">Comparison Filters</p>
          <h2>Ranked Route View</h2>
        </div>
      </div>

      <div className="form-grid compact">
        <label>
          <span>Origin</span>
          <select
            value={filters.originId}
            onChange={(event) => onChange({ ...filters, originId: event.target.value })}
          >
            <option value="all">Any origin</option>
            {tradeLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Destination</span>
          <select
            value={filters.destinationId}
            onChange={(event) => onChange({ ...filters, destinationId: event.target.value })}
          >
            <option value="all">Any destination</option>
            {tradeLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Cargo Type</span>
          <select
            value={filters.category}
            onChange={(event) =>
              onChange({
                ...filters,
                category: event.target.value as GoodCategory | "all",
              })
            }
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort By</span>
          <select
            value={filters.sortBy}
            onChange={(event) =>
              onChange({
                ...filters,
                sortBy: event.target.value as RouteComparisonFilters["sortBy"],
              })
            }
          >
            <option value="profitPerDay">Profit / day</option>
            <option value="netProfit">Net profit</option>
            <option value="profitPerAu">Profit / AU</option>
          </select>
        </label>
      </div>
    </section>
  );
}

