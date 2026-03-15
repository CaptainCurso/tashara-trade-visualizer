import type { Location, MarketEntry } from "../types/economy";

function marketEntry(
  goodId: string,
  config: Omit<MarketEntry, "goodId">,
): MarketEntry {
  return {
    goodId,
    ...config,
  };
}

export const locations: Location[] = [
  {
    id: "rock_of_bral",
    name: "Rock of Bral",
    type: "hub",
    orbitalBodyId: "rock_of_bral_body",
    shortDescription:
      "The sphere's conversion hub for coin, information, ship services, and premium offworld resale.",
    description:
      "The Rock of Bral functions as the Tashara Sphere's central exchange point. It converts exotic goods into Gold Press value, keeps the strongest information market in the system, and maintains the established Bral trading compounds on Qesh, Vesha-Kai, and Tash-Ahn.",
    primarySettlement: "Central docks and temporary Tashara market wards",
    population: "Transient multi-sphere population",
    currency: "Gold Press standard",
    factions: [
      "Bral merchant houses",
      "Temporary trading post operators",
      "Independent salvagers and information brokers",
    ],
    produces: [
      "Gold Press conversion and wholesale exchange",
      "Books, medical supplies, and precision trade tools",
      "Spelljamming repairs, components, and inter-sphere knowledge",
    ],
    demands: [
      "Food, fuel, timber, and bulk construction stock",
      "Premium textiles, tuned crystals, artifacts, and cultural goods",
      "Astronomical data, rare specimens, and precursor salvage",
    ],
    bonuses: [
      {
        label: "Only GP Converter",
        description: "Bral is the only reliable Gold Press conversion point named in the lore.",
        type: "price",
      },
      {
        label: "Established Posts",
        description: "Bral already has footholds on Qesh, Vesha-Kai, and Tash-Ahn.",
        type: "service",
      },
      {
        label: "Premium Novelty Market",
        description: "Collectors and scholars pay above baseline for unique Tashara goods.",
        type: "price",
      },
    ],
    rules: [
      {
        label: "Entrenched Competition",
        description: "Existing Bral merchants already protect profitable routes and contracts.",
        severity: "moderate",
      },
      {
        label: "Wholesale Bias",
        description: "The best Bral prices usually come from repeatable cargo or truly novel finds.",
        severity: "low",
      },
    ],
    notes: [
      "Trade Web lore marks Bral as the hub for converting Tashara goods into system-wide value.",
      "Phase 1 models Bral on a fast, GM-controlled orbit so route math can respond to the current day.",
    ],
    market: [
      marketEntry("books", {
        buyModifier: 0.85,
        supply: "steady",
        demand: "low",
        notes: "Bral sells books outward more readily than it buys local copies back.",
      }),
      marketEntry("medical_supplies", {
        buyModifier: 0.92,
        supply: "steady",
        demand: "low",
        notes: "Reliable source for medicine before frontier runs.",
      }),
      marketEntry("metal_tools", {
        buyModifier: 0.88,
        supply: "steady",
        demand: "low",
        notes: "Strong outbound staple into low-metallurgy markets.",
      }),
      marketEntry("navigation_instruments", {
        buyModifier: 0.9,
        supply: "steady",
        demand: "low",
        notes: "A frequent export to worlds hungry for better navigation methods.",
      }),
      marketEntry("communication_crystals", {
        buyModifier: 1.03,
        supply: "scarce",
        demand: "moderate",
        notes: "Bral can source them, but the best ones remain expensive.",
      }),
      marketEntry("preserved_foods", {
        buyModifier: 1.02,
        supply: "steady",
        demand: "low",
        notes: "Bulk provisions for steady route building.",
      }),
      marketEntry("water_and_ice", {
        sellModifier: 1.15,
        supply: "none",
        demand: "moderate",
        notes: "Certain Bral districts pay above baseline for imported water and ice.",
      }),
      marketEntry("timber_and_fuel", {
        sellModifier: 1.1,
        supply: "none",
        demand: "moderate",
        notes: "Fuel and construction stock are always absorbable at the hub.",
      }),
      marketEntry("breath_woven_textiles", {
        sellModifier: 1.35,
        supply: "none",
        demand: "high",
        notes: "Premium resale market among shipwrights and collectors.",
      }),
      marketEntry("bio_luminescent_dyes", {
        sellModifier: 1.28,
        supply: "none",
        demand: "high",
        notes: "Novelty dye lots sell well in premium markets.",
      }),
      marketEntry("chitin_armor", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "Specialty armor with a distinct story value.",
      }),
      marketEntry("philosophical_texts", {
        sellModifier: 1.2,
        supply: "none",
        demand: "moderate",
        notes: "Academic and collector buyers keep this profitable.",
      }),
      marketEntry("star_charts", {
        sellModifier: 1.23,
        supply: "none",
        demand: "moderate",
        notes: "Astronomical data has strong resale value on Bral.",
      }),
      marketEntry("monde_silk", {
        sellModifier: 1.42,
        supply: "none",
        demand: "high",
        notes: "One of the strongest luxury textile premiums in the sphere.",
      }),
      marketEntry("tuned_crystals", {
        sellModifier: 1.55,
        supply: "none",
        demand: "high",
        notes: "Phorvaire's tuned crystals are system-unique and extremely saleable.",
      }),
      marketEntry("resonance_network_components", {
        sellModifier: 1.62,
        supply: "none",
        demand: "high",
        notes: "The highest-tech Phorvaire exports command Bral bidding wars.",
      }),
      marketEntry("steam_engine_parts", {
        sellModifier: 1.28,
        supply: "none",
        demand: "moderate",
        notes: "Industrial curiosity plus practical demand from advanced buyers.",
      }),
      marketEntry("camouflage_dyes", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "Valued by military buyers, hunters, and fashion houses.",
      }),
      marketEntry("rare_jungle_woods", {
        sellModifier: 1.15,
        supply: "none",
        demand: "moderate",
        notes: "Reliable material premium at the hub.",
      }),
      marketEntry("precursor_data_crystals", {
        sellModifier: 1.75,
        supply: "none",
        demand: "high",
        notes: "One of the strongest seeded premiums in the phase 1 model.",
      }),
      marketEntry("rare_transition_metals", {
        sellModifier: 1.2,
        supply: "none",
        demand: "moderate",
        notes: "Specialty industrial buyers keep rare metals moving.",
      }),
      marketEntry("sun_silver_conductors", {
        sellModifier: 1.45,
        supply: "none",
        demand: "high",
        notes: "Lore-derived magical conductor with clear premium buyers on Bral.",
      }),
    ],
  },
  {
    id: "ember_heart",
    name: "Ember-Heart",
    type: "world",
    orbitalBodyId: "ember_heart_body",
    shortDescription:
      "Scorched extraction world with no standing civilization but exceptional precursor and metal value.",
    description:
      "Ember-Heart is a dangerous resource world rather than a normal market. Phase 1 treats its trade profile as extraction-contract pricing for crews capable of surviving the heat, metallic vapors, and unstable geothermal conditions.",
    population: "No settled intelligent civilization detected",
    currency: "Contract or salvage basis only",
    factions: [
      "Independent extractors",
      "Illegal Bral syndicate interests",
      "Precursor temple guardians and native extremophile hazards",
    ],
    produces: [
      "Rare transition metals",
      "Sun-silver magical conductors",
      "Potential precursor data-crystals from buried temples",
    ],
    demands: [
      "Specialized extraction equipment",
      "Heat shielding and salvage support",
      "Security against swarms and unstable terrain",
    ],
    bonuses: [
      {
        label: "Extreme Scarcity Premium",
        description: "The best Ember-Heart materials have few direct substitutes anywhere else.",
        type: "price",
      },
    ],
    rules: [
      {
        label: "Extraction Site, Not City",
        description: "Trade here represents contract-cost cargo rather than a normal civic market.",
        severity: "moderate",
      },
      {
        label: "Severe Hazard Environment",
        description: "The route math does not currently include the extra operational danger of the surface.",
        severity: "high",
      },
    ],
    notes: [
      "The survey report and gateway dossier both stress rare metals, precursor structures, and heavy extraction risk.",
      "If you later want proper salvage gameplay, Ember-Heart is an ideal event-driven expansion point.",
    ],
    market: [
      marketEntry("rare_transition_metals", {
        buyModifier: 0.64,
        supply: "surplus",
        demand: "none",
        notes: "Modeled as extraction lot cost from dangerous salvage rights and hauling.",
      }),
      marketEntry("sun_silver_conductors", {
        buyModifier: 0.66,
        supply: "scarce",
        demand: "none",
        notes: "Modeled as a high-risk, high-value extraction lot.",
      }),
      marketEntry("precursor_data_crystals", {
        buyModifier: 0.82,
        supply: "scarce",
        demand: "none",
        notes: "Represents uncertain salvage rather than routine supply.",
      }),
    ],
  },
  {
    id: "qesh",
    name: "Qesh",
    type: "world",
    orbitalBodyId: "qesh_body",
    shortDescription:
      "Wind-sailed ocean world whose city-states produce premium textiles but crave metal, medicine, and charts.",
    description:
      "Qesh's drifting city-states are organized around wind-river mastery. Zh'lani and the Confederation offer the most coin-friendly access, while rival settlements often prefer barter or political exchange instead of simple cash deals.",
    primarySettlement: "Zh'lani (Confederation trade focus)",
    population: "~300,000 across seven major city-states",
    currency: "Partial GP access through Zh'lani; barter elsewhere",
    factions: [
      "Confederation of Zh'lani",
      "Free Current Alliance",
      "Still-Water Seekers",
    ],
    produces: [
      "Breath-Woven textiles",
      "Preserved kelp, salt, and pumice",
      "Wind-song instruments and bio-luminescent dyes",
    ],
    demands: [
      "Metal tools and better rope",
      "Medical supplies and anti-parasitic care",
      "Books, star charts, and navigation instruments",
    ],
    bonuses: [
      {
        label: "Premium Textile Export",
        description: "Breath-Woven fabric is one of the easiest lore-backed premium goods to flip to Bral.",
        type: "price",
      },
      {
        label: "Zh'lani Pays in Coin",
        description: "Confederation-aligned buyers are more willing to use GP than other Qeshi factions.",
        type: "service",
      },
    ],
    rules: [
      {
        label: "Currency Split",
        description: "Not every Qeshi settlement honors Gold Press at all.",
        severity: "moderate",
      },
      {
        label: "Wind-Debt Norms",
        description: "Favors and safe passage obligations matter alongside literal cargo prices.",
        severity: "low",
      },
    ],
    notes: [
      "Gateway lore says Bral is currently on the Qesh-facing side of its route; this influenced the default phase 1 snapshot.",
      "Qesh is the best seeded origin for textile-heavy early runs.",
    ],
    market: [
      marketEntry("breath_woven_textiles", {
        buyModifier: 0.62,
        supply: "surplus",
        demand: "low",
        notes: "Qesh's signature export and one of the clearest trade anchors in the lore.",
      }),
      marketEntry("preserved_kelp", {
        buyModifier: 0.68,
        supply: "surplus",
        demand: "low",
        notes: "Cheap staple cargo for bulk runs.",
      }),
      marketEntry("pumice_stone", {
        buyModifier: 0.72,
        supply: "surplus",
        demand: "low",
        notes: "Useful for low-margin bulk freight or specialized construction buyers.",
      }),
      marketEntry("salt", {
        buyModifier: 0.7,
        supply: "surplus",
        demand: "low",
        notes: "Strong volume, low margin.",
      }),
      marketEntry("wind_song_instruments", {
        buyModifier: 0.78,
        supply: "steady",
        demand: "moderate",
        notes: "Collector goods with good Bral upside.",
      }),
      marketEntry("bio_luminescent_dyes", {
        buyModifier: 0.74,
        supply: "steady",
        demand: "moderate",
        notes: "Good premium cargo if you want lighter loads.",
      }),
      marketEntry("metal_tools", {
        sellModifier: 1.42,
        supply: "none",
        demand: "high",
        notes: "Qesh's near-total metallurgy gap keeps this highly profitable.",
      }),
      marketEntry("medical_supplies", {
        sellModifier: 1.5,
        supply: "none",
        demand: "high",
        notes: "Parasite treatment is a repeatable, lore-backed need.",
      }),
      marketEntry("books", {
        sellModifier: 1.35,
        supply: "none",
        demand: "moderate",
        notes: "Books are culturally attractive as well as practical.",
      }),
      marketEntry("navigation_instruments", {
        sellModifier: 1.32,
        supply: "none",
        demand: "high",
        notes: "Navigation beyond wind-reading commands a premium.",
      }),
      marketEntry("preserved_foods", {
        sellModifier: 1.22,
        supply: "none",
        demand: "moderate",
        notes: "Qeshi diets are monotonous enough that variety sells.",
      }),
      marketEntry("rope_and_cable", {
        sellModifier: 1.24,
        supply: "none",
        demand: "moderate",
        notes: "Better rigging stock is explicitly named as a need.",
      }),
    ],
  },
  {
    id: "vesha_kai",
    name: "Vesha-Kai",
    type: "world",
    orbitalBodyId: "vesha_kai_body",
    shortDescription:
      "Rich biosphere world with scholarly and craft exports, but a persistent hunger for metal, healing, and outside knowledge.",
    description:
      "Vesha-Kai is shaped by the Kai-Vesh philosophical schools and the marginalized but culturally vital Vesh-Kai communities. It has a genuine market for alien ideas, moon access, and communication technology, especially through Patient Growth-aligned buyers.",
    primarySettlement: "Grandmother Roost and High Wind Aerie trade zones",
    population: "~350,000 combined Kai-Vesh and Vesh-Kai",
    currency: "Some GP in Patient Growth territories; barter elsewhere",
    factions: [
      "School of Patient Growth",
      "School of the Swift Hunt",
      "School of Sacred Consumption",
      "Vesh-Kai independent communities",
    ],
    produces: [
      "Chitin-forged armor",
      "Medicinal herbs, hardwoods, and ecological craft goods",
      "Philosophical texts and sky-glass from the moons",
    ],
    demands: [
      "Metal ores and worked tools",
      "Magical healing and medical texts",
      "Communication devices, charts, and outside cultural knowledge",
    ],
    bonuses: [
      {
        label: "Strong Knowledge Market",
        description: "Alien culture, philosophy, and inter-world maps fit local demand especially well.",
        type: "price",
      },
      {
        label: "Moon Access Leverage",
        description: "Transport to the Three Sisters can unlock better trade relationships than price alone.",
        type: "service",
      },
    ],
    rules: [
      {
        label: "Faction-Dependent Prices",
        description: "Different schools want different kinds of exchange and recognition.",
        severity: "moderate",
      },
      {
        label: "Cultural Respect Required",
        description: "Trade can fail hard if outsiders mishandle local ethics around death and status.",
        severity: "low",
      },
    ],
    notes: [
      "Vesha-Kai is a good mid-game knowledge-and-craft market if you want a less obvious route than Bral-to-Qesh.",
      "Several moon hooks are already present in the lore for later content.",
    ],
    market: [
      marketEntry("chitin_armor", {
        buyModifier: 0.68,
        supply: "steady",
        demand: "low",
        notes: "Patient Growth can supply the most consistent larger lots.",
      }),
      marketEntry("medicinal_herbs", {
        buyModifier: 0.76,
        supply: "steady",
        demand: "low",
        notes: "Useful cargo with good internal demand elsewhere too.",
      }),
      marketEntry("hardwood", {
        buyModifier: 0.74,
        supply: "steady",
        demand: "low",
        notes: "Reliable export into Bral or shipbuilding-adjacent markets.",
      }),
      marketEntry("philosophical_texts", {
        buyModifier: 0.82,
        supply: "steady",
        demand: "moderate",
        notes: "High signal, low bulk cargo.",
      }),
      marketEntry("sky_glass", {
        buyModifier: 0.84,
        supply: "scarce",
        demand: "moderate",
        notes: "Moon-linked specialty export.",
      }),
      marketEntry("ore_and_raw_metals", {
        sellModifier: 1.32,
        supply: "none",
        demand: "high",
        notes: "Metal scarcity is one of Vesha-Kai's clearest needs.",
      }),
      marketEntry("metal_tools", {
        sellModifier: 1.28,
        supply: "none",
        demand: "high",
        notes: "Worked metal is easier to move than raw ore and still sells well.",
      }),
      marketEntry("books", {
        sellModifier: 1.22,
        supply: "none",
        demand: "moderate",
        notes: "Especially strong if the books compare alien cultures and customs.",
      }),
      marketEntry("medical_supplies", {
        sellModifier: 1.16,
        supply: "none",
        demand: "moderate",
        notes: "They have medicine, but magical or advanced supplies still matter.",
      }),
      marketEntry("communication_crystals", {
        sellModifier: 1.34,
        supply: "none",
        demand: "high",
        notes: "Inter-school coordination is explicitly a problem the lore calls out.",
      }),
      marketEntry("star_charts", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "Maps and offworld knowledge pair well with their moon ambitions.",
      }),
    ],
  },
  {
    id: "tash_ahn",
    name: "Tash-Ahn",
    type: "world",
    orbitalBodyId: "tash_ahn_body",
    shortDescription:
      "The most internally fragmented trade world in the system, ideal for broker-style cargo runs and commissions.",
    description:
      "Tash-Ahn's desert, mountain, and coastal peoples each hold a different piece of a very profitable internal market. Even before leaving the planet, a trader who can move goods between Tash-Vhen, Ahn-Sharek, and Vhen-Dok groups can extract value as broker, carrier, and diplomatic fixer.",
    primarySettlement: "Keth-Saran, Thunderpeak Hold, and Tidecall Harbor",
    population: "~650,000 across three major civilizations",
    currency: "Mixed: GP in some Tash-Vhen and Vhen-Dok markets; barter or song-debt elsewhere",
    factions: [
      "Orthodox Tash-Vhen of Keth-Saran",
      "Reformed Tash-Vhen of Zur-Malak",
      "Ahn-Sharek mountain clans",
      "Vhen-Dok wave-clans",
    ],
    produces: [
      "Star charts, glass lenses, and astronomical instruments",
      "Ore, metals, rope, and mountain herbs",
      "Preserved fish, coral, pearls, and coastal navigation knowledge",
    ],
    demands: [
      "Fresh water solutions, books, and broader system maps",
      "Communication methods and outside knowledge",
      "Brokerage between the planet's own peoples",
    ],
    bonuses: [
      {
        label: "Triple-Market Arbitrage",
        description: "Three semi-isolated civilizations create excellent broker opportunities.",
        type: "price",
      },
      {
        label: "Established Bral Post",
        description: "Keth-Saran already has a Bral foothold to start from.",
        type: "service",
      },
    ],
    rules: [
      {
        label: "Fragmented Currency Norms",
        description: "Not every internal market accepts coin, and obligations can matter as much as price.",
        severity: "moderate",
      },
      {
        label: "Water Politics",
        description: "Local conflict can quickly reshape which desert markets are safe or open.",
        severity: "high",
      },
    ],
    notes: [
      "The survey report explicitly ranks Tash-Ahn as the strongest first-contact commercial target.",
      "If you want a route table that answers 'what should we do next?', Tash-Ahn is the system's best brokerage anchor.",
    ],
    market: [
      marketEntry("star_charts", {
        buyModifier: 0.75,
        supply: "steady",
        demand: "low",
        notes: "One of Tash-Ahn's signature exports.",
      }),
      marketEntry("glass_lenses", {
        buyModifier: 0.72,
        supply: "steady",
        demand: "low",
        notes: "High-quality optics are a standout desert craft export.",
      }),
      marketEntry("astronomical_instruments", {
        buyModifier: 0.8,
        supply: "steady",
        demand: "moderate",
        notes: "Higher value, lower volume than lenses alone.",
      }),
      marketEntry("ore_and_raw_metals", {
        buyModifier: 0.7,
        supply: "surplus",
        demand: "low",
        notes: "Ahn-Sharek output keeps this one of the better system metal origins.",
      }),
      marketEntry("rope_and_cable", {
        buyModifier: 0.74,
        supply: "steady",
        demand: "low",
        notes: "Useful cross-system utility cargo.",
      }),
      marketEntry("preserved_fish", {
        buyModifier: 0.72,
        supply: "surplus",
        demand: "low",
        notes: "Good for bulk, lower-margin supply chains.",
      }),
      marketEntry("coral_and_pearls", {
        buyModifier: 0.82,
        supply: "steady",
        demand: "moderate",
        notes: "Luxury export with broader Bral resale value.",
      }),
      marketEntry("books", {
        sellModifier: 1.25,
        supply: "none",
        demand: "moderate",
        notes: "Books perform well in all three cultures for different reasons.",
      }),
      marketEntry("medical_supplies", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "A steady rather than desperate need.",
      }),
      marketEntry("metal_tools", {
        sellModifier: 1.15,
        supply: "none",
        demand: "moderate",
        notes: "Especially relevant for Tash-Vhen buyers.",
      }),
      marketEntry("communication_crystals", {
        sellModifier: 1.16,
        supply: "none",
        demand: "moderate",
        notes: "Useful for continent-spanning coordination.",
      }),
      marketEntry("water_and_ice", {
        sellModifier: 1.38,
        supply: "none",
        demand: "high",
        notes: "Best treated as a targeted desert-city sale rather than planet-wide average.",
      }),
      marketEntry("breath_woven_textiles", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "Well-suited to rope, rigging, and prestige demand.",
      }),
    ],
  },
  {
    id: "shakti_monde",
    name: "Shakti-Monde",
    type: "world",
    orbitalBodyId: "shakti_monde_body",
    shortDescription:
      "Relationship-first exchange world whose silk and navigation culture offer strong upside once trust is established.",
    description:
      "Shakti-Monde's economy behaves more like gift diplomacy than hard bargaining. The phase 1 market data still gives it prices, but the location panel keeps the lore warning visible because social trust and help with the Monde epidemic matter as much as any cargo ledger.",
    primarySettlement: "Grandmother Roost and allied roost networks",
    population: "~530,000 Shakti across four cultural regions",
    currency: "Minimal GP understanding; communal exchange is the norm",
    factions: [
      "Forest Roosts",
      "Cliff Roosts",
      "Coast Roosts",
      "Grassland Nomads",
    ],
    produces: [
      "Monde-silk and lightweight metalwork",
      "Song-maps and aerial navigation knowledge",
      "Forest resources and symbiosis-linked medical insight",
    ],
    demands: [
      "Medicine for the Monde epidemic",
      "Metal ores and preserved food reserves",
      "Books, outside knowledge, and diplomatic mediation",
    ],
    bonuses: [
      {
        label: "High-Value Textile Export",
        description: "Monde-silk is one of the cleanest premium luxury routes back to Bral.",
        type: "price",
      },
      {
        label: "Trust Unlocks Better Trades",
        description: "Helping with the epidemic or song-rights dispute should later justify stronger bonuses.",
        type: "service",
      },
    ],
    rules: [
      {
        label: "Gift Economy",
        description: "Pressing too hard on price alone misreads how Shakti exchange actually works.",
        severity: "moderate",
      },
      {
        label: "Disease Anxiety",
        description: "Outside ships may face caution or quarantine if disease risk seems high.",
        severity: "moderate",
      },
    ],
    notes: [
      "Shakti-Monde is one of the clearest future-growth markets once you want more than basic commodity loops.",
      "The app currently prices this market as if goodwill exists, but the assumption is documented for easy tuning.",
    ],
    market: [
      marketEntry("monde_silk", {
        buyModifier: 0.6,
        supply: "steady",
        demand: "moderate",
        notes: "One of the best seeded luxury buys in the system.",
      }),
      marketEntry("lightweight_metalwork", {
        buyModifier: 0.74,
        supply: "steady",
        demand: "moderate",
        notes: "Smaller margins than silk but still a solid export.",
      }),
      marketEntry("song_maps", {
        buyModifier: 0.8,
        supply: "scarce",
        demand: "moderate",
        notes: "Knowledge-rich cargo that rewards careful handling.",
      }),
      marketEntry("timber_and_fuel", {
        buyModifier: 0.76,
        supply: "steady",
        demand: "low",
        notes: "Represents forest and forge stock they can spare in phase 1.",
      }),
      marketEntry("medical_supplies", {
        sellModifier: 1.55,
        supply: "none",
        demand: "high",
        notes: "The Monde epidemic is one of the system's clearest urgent needs.",
      }),
      marketEntry("ore_and_raw_metals", {
        sellModifier: 1.34,
        supply: "none",
        demand: "high",
        notes: "Metal ores are explicitly called out as a recurring need.",
      }),
      marketEntry("books", {
        sellModifier: 1.25,
        supply: "none",
        demand: "moderate",
        notes: "Knowledge-hungry market with a communal learning culture.",
      }),
      marketEntry("preserved_foods", {
        sellModifier: 1.2,
        supply: "none",
        demand: "moderate",
        notes: "Especially useful for harsher seasonal regions.",
      }),
      marketEntry("communication_crystals", {
        sellModifier: 1.16,
        supply: "none",
        demand: "moderate",
        notes: "Helpful but secondary compared with medicine and ore.",
      }),
    ],
  },
  {
    id: "phorvaire",
    name: "Phorvaire",
    type: "world",
    orbitalBodyId: "phorvaire_body",
    shortDescription:
      "Orbital rendezvous market where tuned crystal exports meet desperate demand for water and organic material.",
    description:
      "Phorvaire's safe trading posture is orbital rather than surface-based. The Khor produce some of the most valuable technology in the sphere, but the costs of dealing with volcanic conditions and factional mistrust make this a strategic rather than casual route.",
    primarySettlement: "Khorvanum via orbital rendezvous contacts",
    population: "~250,000 Khor across major resonance groups",
    currency: "Surface Singers and some middle groups understand GP; Deep Resonance may refuse all exchange",
    factions: [
      "Surface Singers",
      "Middle Resonance",
      "Deep Resonance",
    ],
    produces: [
      "Tuned crystals and Resonance Network technology",
      "Heat-resistant materials and rare minerals",
      "Gemstock and geological expertise",
    ],
    demands: [
      "Water and organic materials",
      "Biology, medicine, and books about carbon-based life",
      "Safer access to ruins and asteroid ring opportunities",
    ],
    bonuses: [
      {
        label: "System-Unique Tech",
        description: "Tuned crystals and resonance components justify top-tier resale pricing.",
        type: "price",
      },
      {
        label: "Cross-System Utility",
        description: "Qesh, Ashar, Sharek, and Bral all have lore reasons to value Phorvaire tech.",
        type: "service",
      },
    ],
    rules: [
      {
        label: "Orbital-Only Trade",
        description: "Phase 1 prices this node as a rendezvous market instead of a surface one.",
        severity: "moderate",
      },
      {
        label: "Factional Access Risk",
        description: "Deep Resonance hostility can change which buyers are truly reachable.",
        severity: "high",
      },
    ],
    notes: [
      "The lore strongly suggests this should become a richer faction-and-access system later.",
      "For phase 1, it already provides one of the best premium outbound routes in the system.",
    ],
    market: [
      marketEntry("tuned_crystals", {
        buyModifier: 0.6,
        supply: "steady",
        demand: "low",
        notes: "The signature Phorvaire export.",
      }),
      marketEntry("heat_resistant_materials", {
        buyModifier: 0.68,
        supply: "steady",
        demand: "low",
        notes: "Practical export with broader industrial buyers.",
      }),
      marketEntry("raw_gemstones", {
        buyModifier: 0.78,
        supply: "steady",
        demand: "moderate",
        notes: "Strong but less dramatic than tuned crystal routes.",
      }),
      marketEntry("resonance_network_components", {
        buyModifier: 0.64,
        supply: "scarce",
        demand: "moderate",
        notes: "Very high-value cargo with correspondingly tight access.",
      }),
      marketEntry("water_and_ice", {
        sellModifier: 1.8,
        supply: "none",
        demand: "high",
        notes: "The clearest bulk need in Phorvaire's market profile.",
      }),
      marketEntry("books", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "Knowledge remains important even after immediate survival needs.",
      }),
      marketEntry("medical_supplies", {
        sellModifier: 1.12,
        supply: "none",
        demand: "moderate",
        notes: "Useful more as a study of biology than a direct cure market.",
      }),
      marketEntry("hardwood", {
        sellModifier: 1.22,
        supply: "none",
        demand: "moderate",
        notes: "Represents the broader need for organic material and plant matter.",
      }),
      marketEntry("rare_transition_metals", {
        sellModifier: 1.12,
        supply: "none",
        demand: "moderate",
        notes: "Industrial buyers can absorb Ember-Heart metals here too.",
      }),
    ],
  },
  {
    id: "ashar",
    name: "Ashar",
    type: "world",
    orbitalBodyId: "ashar_body",
    shortDescription:
      "Red twin world where industrial curiosity, theology, and deep-clan resources collide around the dream of reaching Sharek.",
    description:
      "Ashar's value is not only in its cargo. The Asharen will spend heavily on anything that advances survival on the surface or even hints at reaching Sharek, which means service contracts and information asymmetry matter as much as freight.",
    primarySettlement: "Kelvareth Deep and allied depth-clan holdings",
    population: "~400,000 Asharen",
    currency: "GP established from prior Bral visits",
    factions: [
      "Deep-clans",
      "Surface-clans",
      "Rocket research coalitions",
      "Death-observation priesthoods",
    ],
    produces: [
      "Excavation gear and explosives",
      "Steam-era engineering and heat-storage materials",
      "Gemstones and detailed astronomical observations of Sharek",
    ],
    demands: [
      "Any path toward Sharek",
      "Medicine, books, and surface survival improvements",
      "Agricultural and communication knowledge",
    ],
    bonuses: [
      {
        label: "Sharek Obsession Premium",
        description: "Ashar has lore-backed willingness to overpay for anything tied to reaching Sharek.",
        type: "price",
      },
      {
        label: "Industrial Curiosity",
        description: "Asharen engineering culture values advanced instruments and knowledge transfer.",
        type: "service",
      },
    ],
    rules: [
      {
        label: "Theological Instability",
        description: "Information about Sharek's true status can explode the market as easily as enrich it.",
        severity: "high",
      },
      {
        label: "Depth-Clan Politics",
        description: "Access and pricing can hinge on which clan sponsors the deal.",
        severity: "moderate",
      },
    ],
    notes: [
      "Ashar is the clearest place in the current data model where service trades should later sit beside cargo trades.",
      "Phase 1 still captures a good freight market by pricing books, medicine, and instruments strongly.",
    ],
    market: [
      marketEntry("excavation_gear", {
        buyModifier: 0.76,
        supply: "steady",
        demand: "low",
        notes: "Excellent export into frontier or salvage-minded buyers.",
      }),
      marketEntry("explosives", {
        buyModifier: 0.74,
        supply: "steady",
        demand: "moderate",
        notes: "Valuable but politically sensitive cargo.",
      }),
      marketEntry("steam_engine_parts", {
        buyModifier: 0.72,
        supply: "scarce",
        demand: "moderate",
        notes: "Industrial export with good curiosity premium elsewhere.",
      }),
      marketEntry("raw_gemstones", {
        buyModifier: 0.72,
        supply: "steady",
        demand: "low",
        notes: "More predictable than their higher-drama tech or theology routes.",
      }),
      marketEntry("star_charts", {
        buyModifier: 0.8,
        supply: "steady",
        demand: "moderate",
        notes: "Ashar's Sharek-focused astronomy is its own valuable knowledge export.",
      }),
      marketEntry("books", {
        sellModifier: 1.25,
        supply: "none",
        demand: "moderate",
        notes: "Books about the wider cosmos or engineering are especially valuable here.",
      }),
      marketEntry("medical_supplies", {
        sellModifier: 1.28,
        supply: "none",
        demand: "high",
        notes: "Respiratory and underground-living ailments make medicine a strong sale.",
      }),
      marketEntry("preserved_foods", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "Agricultural limitations create reliable food-import value.",
      }),
      marketEntry("communication_crystals", {
        sellModifier: 1.22,
        supply: "none",
        demand: "moderate",
        notes: "Supports coordination between depth-clans and research coalitions.",
      }),
      marketEntry("navigation_instruments", {
        sellModifier: 1.14,
        supply: "none",
        demand: "moderate",
        notes: "Less important than reaching Sharek, but still respectable.",
      }),
    ],
  },
  {
    id: "sharek",
    name: "Sharek",
    type: "world",
    orbitalBodyId: "sharek_body",
    shortDescription:
      "Blue twin world of flotillas and jungle cities where maritime craft meets metal hunger and theological tension.",
    description:
      "Sharek holds two overlapping markets: the sea-based Sharek flotillas and the land-based Sauresh city-states. The former value shipping, marine resources, and outside knowledge; the latter want metallurgy, arms access, and leverage over rivals.",
    primarySettlement: "Tala-Sharek and allied Sauresh trade corridors",
    population: "~500,000 combined Sharek and Sauresh",
    currency: "Sauresh city-states have GP; Sharek flotillas mostly prefer barter or selective coin use",
    factions: [
      "Eastern Flotillas",
      "Western Alliance",
      "Jungle-Walkers",
      "Sauresh city-states",
    ],
    produces: [
      "Marine resources, pearls, coral, and advanced shipbuilding methods",
      "Rare jungle woods and camouflage dyes",
      "Navigation expertise and amphibious construction knowledge",
    ],
    demands: [
      "Corrosion-resistant metal tools",
      "Medicine and more varied food stocks",
      "Information about Ashar and the wider system",
    ],
    bonuses: [
      {
        label: "Dual-Market Variety",
        description: "Sea and jungle economies let Sharek buy and sell different cargo types at once.",
        type: "price",
      },
      {
        label: "Future First-Contact Hook",
        description: "Sharek becomes far more valuable if you later add Ashar-Sharek revelation events.",
        type: "service",
      },
    ],
    rules: [
      {
        label: "Theological Secrecy",
        description: "Ashar's true status is both a market opportunity and a destabilizing risk.",
        severity: "high",
      },
      {
        label: "Faction Fragmentation",
        description: "Traditional flotillas, progressive flotillas, and Sauresh states do not want the same deals.",
        severity: "moderate",
      },
    ],
    notes: [
      "Sharek's cargo profile is strongest when paired with Tash-Ahn, Bral, or future Ashar service routes.",
      "The current data model prices this node conservatively until more sub-market detail is added.",
    ],
    market: [
      marketEntry("preserved_fish", {
        buyModifier: 0.76,
        supply: "surplus",
        demand: "low",
        notes: "Bulk marine staple cargo.",
      }),
      marketEntry("coral_and_pearls", {
        buyModifier: 0.72,
        supply: "steady",
        demand: "moderate",
        notes: "Broadly saleable luxury cargo.",
      }),
      marketEntry("rare_jungle_woods", {
        buyModifier: 0.74,
        supply: "steady",
        demand: "moderate",
        notes: "Sauresh wood export with good craft and Bral demand.",
      }),
      marketEntry("camouflage_dyes", {
        buyModifier: 0.78,
        supply: "steady",
        demand: "moderate",
        notes: "A standout Sauresh military-luxury export.",
      }),
      marketEntry("water_and_ice", {
        buyModifier: 0.76,
        supply: "surplus",
        demand: "low",
        notes: "Useful as outbound cargo to harsher markets.",
      }),
      marketEntry("metal_tools", {
        sellModifier: 1.35,
        supply: "none",
        demand: "high",
        notes: "Metal scarcity and corrosion keep this profitable.",
      }),
      marketEntry("medical_supplies", {
        sellModifier: 1.28,
        supply: "none",
        demand: "high",
        notes: "Parasite treatment and general medicine both sell well.",
      }),
      marketEntry("books", {
        sellModifier: 1.18,
        supply: "none",
        demand: "moderate",
        notes: "Books sell especially well through Jungle-Walker intermediaries and Sauresh elites.",
      }),
      marketEntry("navigation_instruments", {
        sellModifier: 1.16,
        supply: "none",
        demand: "moderate",
        notes: "Useful but not as urgent as metal or medicine.",
      }),
      marketEntry("preserved_foods", {
        sellModifier: 1.12,
        supply: "none",
        demand: "moderate",
        notes: "Dietary variety matters even on a resource-rich ocean world.",
      }),
    ],
  },
  {
    id: "tashara_major",
    name: "Tashara-Major",
    type: "star",
    orbitalBodyId: "tashara_major",
    shortDescription: "The brighter yellow sun of the binary pair.",
    description:
      "Tashara-Major is the dominant star of the system and one half of the binary center that shapes the Tashara seasons, dim hours, and orbital behavior.",
    factions: [],
    produces: ["Solar radiation", "Star-drake feeding ground access"],
    demands: [],
    bonuses: [],
    rules: [
      {
        label: "Navigation Hazard",
        description: "The inner star lanes can bring ships into contact with star-drakes and intense heat.",
        severity: "high",
      },
    ],
    notes: ["This node is for navigation context rather than trade."],
    market: [],
  },
  {
    id: "tashara_minor",
    name: "Tashara-Minor",
    type: "star",
    orbitalBodyId: "tashara_minor",
    shortDescription: "The dimmer orange-gold companion to Tashara-Major.",
    description:
      "Tashara-Minor contributes the secondary light rhythm that helps create Tashara's dim hours and unusual seasonal language.",
    factions: [],
    produces: ["Secondary solar illumination", "Outer-system gravitational influence"],
    demands: [],
    bonuses: [],
    rules: [
      {
        label: "Navigation Context",
        description: "Useful for understanding the system map, but not a market node.",
        severity: "low",
      },
    ],
    notes: ["Included so the map remains legible and lore-faithful."],
    market: [],
  },
  {
    id: "spiral_gate",
    name: "Spiral Gate",
    type: "gate",
    orbitalBodyId: "spiral_gate_body",
    shortDescription: "One of the two sphere gates that frame Bral's route logic.",
    description:
      "The lore map places the Spiral Gate on the upper-left edge of the sphere, making it a useful orientation point for Bral's fast movement pattern and later wildspace expansion.",
    factions: [],
    produces: ["Travel context"],
    demands: [],
    bonuses: [],
    rules: [
      {
        label: "Strategic Marker",
        description: "Phase 1 treats gates as navigation landmarks rather than trade destinations.",
        severity: "low",
      },
    ],
    notes: ["Shown to explain why Bral's movement matters beyond simple circular orbit math."],
    market: [],
  },
  {
    id: "coreward_gate",
    name: "Coreward Gate",
    type: "gate",
    orbitalBodyId: "coreward_gate_body",
    shortDescription: "The opposing gate landmark on the sphere map.",
    description:
      "The Coreward Gate mirrors the Spiral Gate on the opposite side of the sphere and helps communicate Bral's gate-aligned movement corridor.",
    factions: [],
    produces: ["Travel context"],
    demands: [],
    bonuses: [],
    rules: [
      {
        label: "Strategic Marker",
        description: "Phase 1 keeps the gate visible for map clarity and future expansion.",
        severity: "low",
      },
    ],
    notes: ["Useful future hook if you later add off-sphere route planning."],
    market: [],
  },
];

