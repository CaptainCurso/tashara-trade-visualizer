# Phase 1 Assumptions

These assumptions were made so the first functional version could be built without blocking on missing or conflicting data.

## Orbital Distances

- The lore gives orbital periods, but not explicit AU distances for each world.
- Phase 1 derives readable AU orbit radii from the stated orbital periods and keeps them in `src/data/settings.ts` / `src/data/locations.ts`-adjacent config instead of hardcoding them inside the UI.

## Starting Orbital Angles

- The lore map image gives relative placement, not exact angles.
- Day 0 orbital starting angles are estimated from the map image so the worlds appear in approximately the same sectors.

## Rock of Bral Position

- One lore source says Bral is currently around Qesh.
- The map image places a Bral icon near the Spiral Gate.
- Phase 1 resolves this by:
  - using an editable 60-day gate-to-gate transfer so its position affects route math
  - starting Bral at the Spiral Gate side of the system on day 0
  - keeping both gates visible so the broader movement concept remains understandable
- This is intentionally editable in `src/data/settings.ts`.

## Bral Movement Model

- The lore says Bral moves faster than the planets and travels between the two gates.
- Phase 1 now models that as a single hyperbolic-style transfer path between the two gates with one close pass by the suns.
- The app uses an editable 60-day transit window rather than a full simulation of repeated Bral traffic cycles.
- This was chosen for clarity, route-planning usefulness, and easy future tuning.

## Distance Math

- Distance is currently straight-line AU distance between the current positions of two locations.
- Phase 1 does not model forced lane geometry, orbital insertion cost, docking delay, pirate detours, or hazard slowdown.

## Market Model

- Local prices are represented as buy/sell modifiers against each good's baseline GP price.
- This gives you one clean place to edit the baseline and one clean place to edit local market attitude.
- Not every lore item was suitable as a cargo good. Services such as mediation, transport to moons, and diplomacy are shown in notes/bonuses instead of cargo rows.

## Ember-Heart Trade

- Ember-Heart has no native market.
- Phase 1 still includes limited extraction-contract pricing there so the rare metals and sun-silver mentioned in the lore can appear in the calculator.

## Shakti-Monde Exchange Style

- The lore frames Shakti-Monde exchange as gift-economy based rather than hard coin trade.
- Phase 1 still assigns market numbers so players can compare options, but the location panel calls out the cultural caveat.

## Phorvaire Trading Posture

- The lore strongly suggests orbital rendezvous rather than surface trade.
- Phase 1 treats the Phorvaire node as an orbital trade abstraction for simplicity.

## Price Assumptions

- The seeded GP values are best-guess fantasy trade-lot values based on:
  - rarity in the lore
  - obvious real-world analogues where relevant
  - D&D-style economy intuition
  - the role a good plays in cross-world arbitrage
- All of these prices are meant to be edited.
