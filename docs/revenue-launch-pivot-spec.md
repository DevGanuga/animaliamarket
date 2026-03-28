# Revenue Launch Pivot Spec

## Goal
Launch `animalia.market` as a revenue-first pet wellness storefront that converts current inventory into larger, higher-confidence baskets.

## Core Pivot
Animalia should stop presenting itself primarily as a broad pet marketplace and instead behave like a curated wellness merchandiser.

The store should answer three questions quickly:

1. What problem does this product solve?
2. Why should I trust this recommendation?
3. What should I buy next or buy larger?

## Business Priorities

### 1. Maximize Current Stock
- Push high-intent categories first: joint support, calming, dental, and omega/fish oil.
- Favor in-stock, higher-value, repeat-use items in homepage and collection merchandising.
- Make larger pack sizes feel like the obvious value choice.

### 2. Reduce Trust Friction
- Remove unsupported blanket claims.
- Replace generic trust language with accurate store-level promises.
- Ensure navigation links and collection entry points work cleanly.

### 3. Increase AOV
- Encourage stock-up behavior on repeat-use products.
- Cross-sell adjacent routines: mobility + calming, dental + daily wellness, omega + skin/coat.
- Use collection and PDP copy to guide shoppers toward better-value sizes and complementary items.

## Positioning
Animalia is not trying to out-scale Petco or out-discount Pet Supermarket.

Animalia should win on:
- clearer need-based shopping
- cleaner curation
- calmer, more premium presentation
- faster buying decisions for pet parents who already know the problem they want to solve

## Customer-Facing Strategy

### Homepage
The homepage should lead with revenue-driving problems, not generic marketplace language.

Requirements:
- Hero copy should orient shoppers around solving a pet wellness need now.
- Primary discovery should focus on key concerns:
  - joint support
  - calming
  - dental
  - omega / skin & coat
- Featured products should prioritize monetizable inventory instead of random vendor diversity.
- Trust strip should use accurate store promises, not unsupported product claims.

### Collections
Collections should feel like curated buying guides instead of internal taxonomy.

Requirements:
- Fix broken category entry points.
- Promote the most commercially useful collections first.
- Use cleaner shopper-facing language for collection titles and supporting copy.
- Add collection-level context so shoppers understand who the assortment is for and how to shop it.

### PDPs
PDPs should behave like conversion pages, not plain catalog records.

Requirements:
- Remove misleading generic claims such as blanket vet approval or best-price guarantees.
- Add concise benefit bullets derived from product data and wellness context.
- Add a value message for larger or repeat-use formats where possible.
- Improve free-shipping threshold guidance.
- Make related products feel like routine-building recommendations.
- Use accurate fallback copy when ingredients or usage details are incomplete.

## Competitive Benchmark

### PetLabCo
Adopt:
- outcome-led copy
- strong routine framing
- proof-oriented structure

Do not copy:
- over-claiming clinical authority without proof

### Pet Supermarket
Adopt:
- urgency around offers and high-intent category discovery
- stronger merchandising of current stock

Do not copy:
- noisy promotional clutter

### Petco
Adopt:
- familiarity and shopping confidence
- practical delivery and fulfillment clarity

Do not copy:
- generic big-box sprawl

## Phase 1 Implementation
This phase should ship in code now.

### Included
- Revenue-first homepage merchandising
- Fixed broken `All Products` / collections entry points
- Better collection spotlight and copy
- Safer PDP trust language
- Stronger PDP benefit, shipping, and value guidance
- Improved related-product framing

### Deferred
- Reviews
- subscriptions / repeat delivery
- bundle pricing
- cart upsells
- imported social proof
- richer product metafield management in Shopify Admin

## Launch Checklist
- Verify all top navigation and footer shopping links resolve correctly.
- Audit top 20 PDPs for contradictory ingredients or unsupported claims.
- Confirm homepage featured products are in stock.
- Confirm collection entry points match real shopper intent.
- Confirm PDPs show accurate shipping and return guidance.
- Confirm related products load successfully on representative SKUs.
