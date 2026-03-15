import type { CoordinateAu, GlobalSettings, Location, OrbitalBody } from "../types/economy";
import {
  getOrbitalBodyMap,
  getOrbitalPathSamplesAu,
  getOrbitalPositionAu,
} from "../utils/orbital";

interface SystemMapProps {
  globalSettings: GlobalSettings;
  orbitalBodies: OrbitalBody[];
  locations: Location[];
  currentDay: number;
  selectedLocationId: string;
  destinationId: string;
  stardustPositionAu: CoordinateAu | null;
  shipStatus: "docked" | "in_transit";
  onSelectLocation: (locationId: string) => void;
}

const VIEWBOX_SIZE = 880;
const CENTER = VIEWBOX_SIZE / 2;
const MAP_PADDING = 68;

function polarPoint(radius: number, angleDeg: number): { x: number; y: number } {
  const radians = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER - radius * Math.sin(radians),
  };
}

export function SystemMap(props: SystemMapProps): JSX.Element {
  const {
    globalSettings,
    orbitalBodies,
    locations,
    currentDay,
    selectedLocationId,
    destinationId,
    stardustPositionAu,
    shipStatus,
    onSelectLocation,
  } = props;

  const scale =
    (VIEWBOX_SIZE / 2 - MAP_PADDING) / globalSettings.orbitalDisplay.maxMapRadiusAu;
  const bodyMap = getOrbitalBodyMap(orbitalBodies);

  const positionByBodyId = new Map(
    orbitalBodies.map((body) => [
      body.id,
      getOrbitalPositionAu(body, currentDay, bodyMap),
    ]),
  );

  const positionByLocationId = new Map(
    locations
      .filter((location) => location.orbitalBodyId)
      .map((location) => [location.id, positionByBodyId.get(location.orbitalBodyId!)!]),
  );

  const destination = positionByLocationId.get(destinationId);

  const orbits = orbitalBodies.filter((body) => body.showOrbit && !body.parentId);
  const twinBodies = orbitalBodies.filter((body) => body.motionMode === "binary-child");
  const stardustPosition = stardustPositionAu;

  return (
    <div className="map-shell">
      <svg
        className="system-map"
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        role="img"
        aria-label="Interactive map of the Tashara sphere trade routes"
      >
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="rgba(243, 199, 115, 0.18)" />
            <stop offset="55%" stopColor="rgba(17, 27, 43, 0.12)" />
            <stop offset="100%" stopColor="rgba(8, 12, 20, 0)" />
          </radialGradient>
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill="url(#map-glow)" />

        {Array.from({ length: 40 }).map((_, index) => {
          const x = ((index * 73) % 820) + 24;
          const y = ((index * 113) % 820) + 24;
          const opacity = index % 4 === 0 ? 0.65 : 0.35;

          return <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 1.8 : 1.2} fill={`rgba(255,255,255,${opacity})`} />;
        })}

        {orbits.map((body) => {
          if (body.motionMode === "elliptical") {
            const centerOffset = body.centerOffsetAu ?? { x: 0, y: 0 };
            const cx = CENTER + centerOffset.x * scale;
            const cy = CENTER - centerOffset.y * scale;

            return (
              <ellipse
                key={`${body.id}-orbit`}
                cx={cx}
                cy={cy}
                rx={(body.semiMajorAu ?? 0) * scale}
                ry={(body.semiMinorAu ?? 0) * scale}
                transform={`rotate(${-(body.rotationDeg ?? 0)} ${cx} ${cy})`}
                className="bral-orbit"
              />
            );
          }

          if (body.motionMode === "hyperbolic") {
            const pathPoints = getOrbitalPathSamplesAu(body, bodyMap);

            if (pathPoints.length < 2) {
              return null;
            }

            const pathDefinition = pathPoints
              .map((point, index) => {
                const x = CENTER + point.x * scale;
                const y = CENTER - point.y * scale;
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ");

            return (
              <path
                key={`${body.id}-orbit`}
                d={pathDefinition}
                className="bral-orbit"
              />
            );
          }

          return (
            <circle
              key={`${body.id}-orbit`}
              cx={CENTER}
              cy={CENTER}
              r={(body.radiusAu ?? 0) * scale}
              className="planet-orbit"
            />
          );
        })}

        {twinBodies[0] && (() => {
          const barycenterPosition = positionByBodyId.get("twin_barycenter_body");
          if (!barycenterPosition) {
            return null;
          }

          return (
            <circle
              cx={CENTER + barycenterPosition.x * scale}
              cy={CENTER - barycenterPosition.y * scale}
              r={(twinBodies[0].localOrbitRadiusAu ?? 0) * scale}
              className="binary-orbit"
            />
          );
        })()}

        <line
          x1={CENTER}
          y1={CENTER}
          x2={polarPoint(globalSettings.orbitalDisplay.gateRadiusAu * scale, globalSettings.orbitalDisplay.gateAnglesDeg.spiral).x}
          y2={polarPoint(globalSettings.orbitalDisplay.gateRadiusAu * scale, globalSettings.orbitalDisplay.gateAnglesDeg.spiral).y}
          className="gate-spoke"
        />
        <line
          x1={CENTER}
          y1={CENTER}
          x2={polarPoint(globalSettings.orbitalDisplay.gateRadiusAu * scale, globalSettings.orbitalDisplay.gateAnglesDeg.coreward).x}
          y2={polarPoint(globalSettings.orbitalDisplay.gateRadiusAu * scale, globalSettings.orbitalDisplay.gateAnglesDeg.coreward).y}
          className="gate-spoke"
        />

        {stardustPosition && destination && (
          <line
            x1={CENTER + stardustPosition.x * scale}
            y1={CENTER - stardustPosition.y * scale}
            x2={CENTER + destination.x * scale}
            y2={CENTER - destination.y * scale}
            className="selected-route-line"
          />
        )}

        {locations.map((location) => {
          if (!location.orbitalBodyId) {
            return null;
          }

          const body = bodyMap.get(location.orbitalBodyId);
          const position = positionByLocationId.get(location.id);

          if (!body || !position) {
            return null;
          }

          const x = CENTER + position.x * scale;
          const y = CENTER - position.y * scale;
          const labelOffset = body.labelOffset ?? { x: 12, y: -12 };
          const isSelected = location.id === selectedLocationId;
          const isEndpoint = location.id === destinationId;
          const className = [
            "map-node",
            `node-${location.type}`,
            isSelected ? "is-selected" : "",
            isEndpoint ? "is-endpoint" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <g
              key={location.id}
              className={className}
              onClick={() => onSelectLocation(location.id)}
              tabIndex={0}
              role="button"
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onSelectLocation(location.id);
                }
              }}
            >
              <title>{location.name}</title>
              {location.type === "gate" ? (
                <rect
                  x={x - body.symbolSize / 2}
                  y={y - body.symbolSize / 2}
                  width={body.symbolSize}
                  height={body.symbolSize}
                  transform={`rotate(45 ${x} ${y})`}
                  fill={body.color}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={isSelected ? 3 : 2}
                />
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={body.symbolSize}
                  fill={body.color}
                  filter={location.type === "star" ? "url(#soft-glow)" : undefined}
                />
              )}

              <text x={x + labelOffset.x} y={y + labelOffset.y} className="map-label">
                {location.name}
              </text>
            </g>
          );
        })}

        {stardustPosition && (
          <g className="stardust-node" aria-label="The Stardust player ship">
            <path
              d={`M ${CENTER + stardustPosition.x * scale} ${CENTER - stardustPosition.y * scale - 14}
              L ${CENTER + stardustPosition.x * scale + 9} ${CENTER - stardustPosition.y * scale + 6}
              L ${CENTER + stardustPosition.x * scale} ${CENTER - stardustPosition.y * scale + 14}
              L ${CENTER + stardustPosition.x * scale - 9} ${CENTER - stardustPosition.y * scale + 6} Z`}
              className="stardust-marker"
            />
            <text
              x={CENTER + stardustPosition.x * scale + 14}
              y={CENTER - stardustPosition.y * scale + 18}
              className="stardust-label"
            >
              Stardust
            </text>
            {shipStatus === "in_transit" && (
              <text
                x={CENTER + stardustPosition.x * scale + 14}
                y={CENTER - stardustPosition.y * scale + 34}
                className="stardust-status"
              >
                In transit
              </text>
            )}
          </g>
        )}
      </svg>

      <div className="map-caption">
        <p>
          <strong>{globalSettings.timeModel.label}:</strong> Day {currentDay}. Bral is shown on a single hyperbolic gate-to-gate pass, taking about {globalSettings.orbitalDisplay.bralGateToGateDays} days to swing past the suns and cross the system.
        </p>
      </div>
    </div>
  );
}
