import type { RouteDefinition } from "../types/economy";

export const routes: RouteDefinition[] = [
  {
    id: "bral-qesh",
    from: "rock_of_bral",
    to: "qesh",
    routeType: "established",
    risk: "low",
    travelNotes: [
      "Bral's strongest current market presence sits on Qesh through Zh'lani.",
      "Currency use is reliable only through Confederation-aligned contacts.",
    ],
    modifiers: [
      {
        type: "marketFamiliarity",
        value: 0.1,
        description: "Established Bral post reduces early trade friction.",
      },
    ],
  },
  {
    id: "bral-vesha-kai",
    from: "rock_of_bral",
    to: "vesha_kai",
    routeType: "established",
    risk: "low",
    travelNotes: [
      "Grandmother Roost hosts a Bral trading compound.",
      "School politics can still affect which contracts are honored.",
    ],
    modifiers: [
      {
        type: "trustedPost",
        value: 0.08,
        description: "Known Bral trade post speeds initial deals.",
      },
    ],
  },
  {
    id: "bral-tash-ahn",
    from: "rock_of_bral",
    to: "tash_ahn",
    routeType: "established",
    risk: "low",
    travelNotes: [
      "Keth-Saran is the most straightforward entry point into Tash-Ahn trade.",
      "Inter-species trade beyond the desert cities still requires local brokerage.",
    ],
    modifiers: [
      {
        type: "postAccess",
        value: 0.08,
        description: "Existing post access shortens setup time on arrival.",
      },
    ],
  },
  {
    id: "qesh-tash-ahn",
    from: "qesh",
    to: "tash_ahn",
    routeType: "established",
    risk: "moderate",
    travelNotes: [
      "Classic exchange of textiles for metalwork and glass.",
      "Storm patterns and shifting politics both matter here.",
    ],
    modifiers: [
      {
        type: "crossDemand",
        value: 0.12,
        description: "Strong need matching on both ends encourages repeat runs.",
      },
    ],
  },
  {
    id: "vesha-kai-tash-ahn",
    from: "vesha_kai",
    to: "tash_ahn",
    routeType: "established",
    risk: "moderate",
    travelNotes: [
      "A strong exchange lane for lore, herbs, and crafted goods versus metal and optics.",
      "Red Sails piracy has been reported in this corridor.",
    ],
    modifiers: [
      {
        type: "piracyRisk",
        value: -0.12,
        description: "Known pirate activity near the Vesha-Kai and Tash-Ahn corridor.",
      },
    ],
  },
  {
    id: "vesha-kai-shakti-monde",
    from: "vesha_kai",
    to: "shakti_monde",
    routeType: "frontier",
    risk: "moderate",
    travelNotes: [
      "Useful for exchanging craft, herbs, and metal access against Monde-silk and song-maps.",
      "Trade style changes sharply because Shakti exchange behaves more like gift diplomacy.",
    ],
    modifiers: [
      {
        type: "relationshipTrade",
        value: 0.06,
        description: "Long-term trust can unlock higher-value exchange than the first voyage suggests.",
      },
    ],
  },
  {
    id: "bral-phorvaire",
    from: "rock_of_bral",
    to: "phorvaire",
    routeType: "hazardous",
    risk: "high",
    travelNotes: [
      "Trade should be handled as orbital rendezvous rather than surface cargo handling.",
      "Surface Singers are the best point of contact; Deep Resonance may refuse the deal outright.",
    ],
    modifiers: [
      {
        type: "hazardLogistics",
        value: -0.18,
        description: "Volcanic hazards raise handling difficulty even for profitable cargo.",
      },
    ],
  },
  {
    id: "ashar-sharek",
    from: "ashar",
    to: "sharek",
    routeType: "service",
    risk: "high",
    travelNotes: [
      "This is the highest-leverage cultural route in the sphere.",
      "Theological fallout can outweigh the cargo math if handled carelessly.",
    ],
    modifiers: [
      {
        type: "theologicalRisk",
        value: -0.25,
        description: "Revealing too much too quickly can destabilize both worlds.",
      },
    ],
  },
  {
    id: "bral-spiral-gate",
    from: "rock_of_bral",
    to: "spiral_gate",
    routeType: "gate",
    risk: "moderate",
    travelNotes: [
      "Represents Bral's gate-facing leg toward the spiral approach.",
      "Useful mainly for orientation and future expansion, not player commerce in phase 1.",
    ],
    modifiers: [],
  },
  {
    id: "bral-coreward-gate",
    from: "rock_of_bral",
    to: "coreward_gate",
    routeType: "gate",
    risk: "moderate",
    travelNotes: [
      "Represents Bral's gate-facing leg toward the coreward approach.",
      "Kept visible on the map because Bral's movement matters strategically.",
    ],
    modifiers: [],
  },
];
