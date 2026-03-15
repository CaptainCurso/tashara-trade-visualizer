import type { CoordinateAu, OrbitalBody } from "../types/economy";

function degToRad(value: number): number {
  return (value * Math.PI) / 180;
}

function rotatePoint(point: CoordinateAu, angleDeg: number): CoordinateAu {
  const radians = degToRad(angleDeg);
  return {
    x: point.x * Math.cos(radians) - point.y * Math.sin(radians),
    y: point.x * Math.sin(radians) + point.y * Math.cos(radians),
  };
}

function addPoints(a: CoordinateAu, b: CoordinateAu): CoordinateAu {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtractPoints(a: CoordinateAu, b: CoordinateAu): CoordinateAu {
  return { x: a.x - b.x, y: a.y - b.y };
}

function scalePoint(point: CoordinateAu, scalar: number): CoordinateAu {
  return { x: point.x * scalar, y: point.y * scalar };
}

function solveAffineTransform(
  baseStart: CoordinateAu,
  baseVertex: CoordinateAu,
  baseEnd: CoordinateAu,
  targetStart: CoordinateAu,
  targetVertex: CoordinateAu,
  targetEnd: CoordinateAu,
): ((point: CoordinateAu) => CoordinateAu) | null {
  const baseVectorA = subtractPoints(baseStart, baseVertex);
  const baseVectorB = subtractPoints(baseEnd, baseVertex);
  const targetVectorA = subtractPoints(targetStart, targetVertex);
  const targetVectorB = subtractPoints(targetEnd, targetVertex);
  const determinant =
    baseVectorA.x * baseVectorB.y - baseVectorA.y * baseVectorB.x;

  if (Math.abs(determinant) < 1e-9) {
    return null;
  }

  const inverse = {
    a: baseVectorB.y / determinant,
    b: -baseVectorB.x / determinant,
    c: -baseVectorA.y / determinant,
    d: baseVectorA.x / determinant,
  };

  const matrix = {
    a:
      targetVectorA.x * inverse.a +
      targetVectorB.x * inverse.c,
    b:
      targetVectorA.x * inverse.b +
      targetVectorB.x * inverse.d,
    c:
      targetVectorA.y * inverse.a +
      targetVectorB.y * inverse.c,
    d:
      targetVectorA.y * inverse.b +
      targetVectorB.y * inverse.d,
  };

  return (point: CoordinateAu): CoordinateAu => {
    const relative = subtractPoints(point, baseVertex);

    return addPoints(targetVertex, {
      x: matrix.a * relative.x + matrix.b * relative.y,
      y: matrix.c * relative.x + matrix.d * relative.y,
    });
  };
}

function getHyperbolicBasePoint(
  body: OrbitalBody,
  parameter: number,
): CoordinateAu {
  return {
    x: (body.hyperbolaB ?? 1) * Math.sinh(parameter),
    y: (body.hyperbolaA ?? 1) * Math.cosh(parameter),
  };
}

function getHyperbolicTransform(
  orbitalBody: OrbitalBody,
  bodyMap: Map<string, OrbitalBody>,
): ((point: CoordinateAu) => CoordinateAu) | null {
  const startBody = orbitalBody.routeStartBodyId
    ? bodyMap.get(orbitalBody.routeStartBodyId)
    : undefined;
  const endBody = orbitalBody.routeEndBodyId
    ? bodyMap.get(orbitalBody.routeEndBodyId)
    : undefined;

  if (!startBody || !endBody || !orbitalBody.periapsisCoordinatesAu) {
    return null;
  }

  const start = startBody.fixedCoordinatesAu;
  const end = endBody.fixedCoordinatesAu;

  if (!start || !end) {
    return null;
  }

  const parameterStart = orbitalBody.parameterStart ?? -1.6;
  const parameterEnd = orbitalBody.parameterEnd ?? 1.6;
  const baseStart = getHyperbolicBasePoint(orbitalBody, parameterStart);
  const baseVertex = getHyperbolicBasePoint(orbitalBody, 0);
  const baseEnd = getHyperbolicBasePoint(orbitalBody, parameterEnd);

  return solveAffineTransform(
    baseStart,
    baseVertex,
    baseEnd,
    start,
    orbitalBody.periapsisCoordinatesAu,
    end,
  );
}

export function polarToCartesianAu(radiusAu: number, angleDeg: number): CoordinateAu {
  return {
    x: radiusAu * Math.cos(degToRad(angleDeg)),
    y: radiusAu * Math.sin(degToRad(angleDeg)),
  };
}

export function getOrbitalBodyMap(orbitalBodies: OrbitalBody[]): Map<string, OrbitalBody> {
  return new Map(orbitalBodies.map((body) => [body.id, body]));
}

export function getOrbitalPositionAu(
  orbitalBody: OrbitalBody,
  day: number,
  bodyMap: Map<string, OrbitalBody>,
): CoordinateAu {
  if (orbitalBody.motionMode === "fixed") {
    return orbitalBody.fixedCoordinatesAu ?? { x: 0, y: 0 };
  }

  if (orbitalBody.motionMode === "circular") {
    const parent = orbitalBody.parentId ? bodyMap.get(orbitalBody.parentId) : undefined;
    const parentPosition = parent ? getOrbitalPositionAu(parent, day, bodyMap) : { x: 0, y: 0 };
    const angle =
      (orbitalBody.phaseDeg ?? 0) +
      (day / (orbitalBody.orbitalPeriodDays ?? 1)) * 360;
    const orbitPoint = polarToCartesianAu(orbitalBody.radiusAu ?? 0, angle);

    return {
      x: parentPosition.x + orbitPoint.x,
      y: parentPosition.y + orbitPoint.y,
    };
  }

  if (orbitalBody.motionMode === "elliptical") {
    const parent = orbitalBody.parentId ? bodyMap.get(orbitalBody.parentId) : undefined;
    const parentPosition = parent ? getOrbitalPositionAu(parent, day, bodyMap) : { x: 0, y: 0 };
    const angle =
      (orbitalBody.phaseDeg ?? 0) +
      (day / (orbitalBody.orbitalPeriodDays ?? 1)) * 360;
    const rawPoint = {
      x: (orbitalBody.semiMajorAu ?? 0) * Math.cos(degToRad(angle)),
      y: (orbitalBody.semiMinorAu ?? 0) * Math.sin(degToRad(angle)),
    };
    const rotatedPoint = rotatePoint(rawPoint, orbitalBody.rotationDeg ?? 0);
    const centerOffset = orbitalBody.centerOffsetAu ?? { x: 0, y: 0 };

    return {
      x: parentPosition.x + centerOffset.x + rotatedPoint.x,
      y: parentPosition.y + centerOffset.y + rotatedPoint.y,
    };
  }

  if (orbitalBody.motionMode === "hyperbolic") {
    const transform = getHyperbolicTransform(orbitalBody, bodyMap);

    if (!transform) {
      return orbitalBody.periapsisCoordinatesAu ?? { x: 0, y: 0 };
    }

    const parameterStart = orbitalBody.parameterStart ?? -1.6;
    const parameterEnd = orbitalBody.parameterEnd ?? 1.6;
    const period = orbitalBody.orbitalPeriodDays ?? 1;
    const normalizedProgress =
      period <= 0 ? 0 : Math.max(0, Math.min(1, day / period));
    const parameter =
      parameterStart + (parameterEnd - parameterStart) * normalizedProgress;

    return transform(getHyperbolicBasePoint(orbitalBody, parameter));
  }

  const parent = orbitalBody.parentId ? bodyMap.get(orbitalBody.parentId) : undefined;
  const parentPosition = parent ? getOrbitalPositionAu(parent, day, bodyMap) : { x: 0, y: 0 };
  const angle =
    (orbitalBody.phaseDeg ?? 0) +
    (day / (orbitalBody.localOrbitPeriodDays ?? 1)) * 360;
  const orbitPoint = polarToCartesianAu(orbitalBody.localOrbitRadiusAu ?? 0, angle);

  return {
    x: parentPosition.x + orbitPoint.x,
    y: parentPosition.y + orbitPoint.y,
  };
}

export function getDistanceAu(a: CoordinateAu, b: CoordinateAu): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.hypot(dx, dy);
}

export function getOrbitalPathSamplesAu(
  orbitalBody: OrbitalBody,
  bodyMap: Map<string, OrbitalBody>,
  sampleCount = 48,
): CoordinateAu[] {
  if (orbitalBody.motionMode !== "hyperbolic") {
    return [];
  }

  const transform = getHyperbolicTransform(orbitalBody, bodyMap);

  if (!transform) {
    return [];
  }

  const parameterStart = orbitalBody.parameterStart ?? -1.6;
  const parameterEnd = orbitalBody.parameterEnd ?? 1.6;

  return Array.from({ length: sampleCount }, (_, index) => {
    const progress = index / (sampleCount - 1);
    const parameter =
      parameterStart + (parameterEnd - parameterStart) * progress;

    return transform(getHyperbolicBasePoint(orbitalBody, parameter));
  });
}
