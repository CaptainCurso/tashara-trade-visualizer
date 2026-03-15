# Ton-Based Price Rebalance Notes

This pass rebalanced the goods list so a full 25-ton cargo run can produce profits in the thousands of GP instead of only a few hundred.

## Pricing Approach

- Prices are now treated as the value of a packed merchant ton, not an unprocessed heap of raw commodity.
- Real-world commodity and wholesale references were used as rough anchors for relative value density, then scaled upward for:
  - spelljamming risk
  - interplanetary scarcity
  - fantasy craftsmanship
  - the fact that many Tashara cargos are refined, curated, or culturally premium rather than raw bulk freight

## Anchor Sources

- Wheat references:
  - https://capitalpress.com/2025/01/30/u-s-wheat-export-price-near-lowest-on-global-market-2/
  - https://www.macrotrends.net/3220/
- Cotton reference:
  - https://www.macrotrends.net/5558/global-cotton-prices
- Steel reference:
  - https://www.phoenixsteelservice.com/world-hot-band-pricing/
- Salt reference:
  - https://www.pa.gov/content/dam/copapwp-pagov/en/dgs/documents/documents/costars/2025-2026%20sodium%20chloride%20%28road%20salt%29%20season%20contract.pdf
- Lumber references:
  - https://www.calculatedriskblog.com/2025/03/update-lumber-prices-up-15-yoy.html
  - https://www.constructioncanews.com/softwood-lumber-prices/amp/

## Resulting Design Choice

- Staple cargos remain comparatively cheap per ton.
- Refined tools, instruments, medical goods, luxury textiles, precision glass, and advanced crystal goods now sit much higher.
- Artifact-adjacent or system-unique cargos such as precursor data-crystals and sun-silver conductors are priced at the top of the scale.

## Where To Edit

- Baseline ton prices: `src/data/goods.ts`
- Local buy/sell modifiers: `src/data/locations.ts`
