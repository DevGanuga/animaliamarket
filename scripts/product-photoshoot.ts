#!/usr/bin/env npx tsx
/**
 * Animalia — Unified Product Photoshoot Workflow
 *
 * Pulls a product from Shopify Admin API, constructs rich context from its
 * real data (description, images, variants, vendor, type), generates a
 * standardized set of minimalist product shots via fal.ai nano-banana-pro,
 * and uploads the results back to Shopify.
 *
 * Usage:
 *   npx tsx scripts/product-photoshoot.ts <product-handle-or-numeric-id>
 *   npx tsx scripts/product-photoshoot.ts vetriscience-dog-composure-bacon-5-64-oz
 *   npx tsx scripts/product-photoshoot.ts 9867778490670
 *
 * Flags:
 *   --generate-only     Generate images but don't upload to Shopify
 *   --upload-only        Upload previously generated images (skip generation)
 *   --dry-run            Show what would be generated without calling the API
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";
const FAL_API_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY;
const FAL_ENDPOINT = "https://fal.run/fal-ai/nano-banana-pro/edit";

// Animalia brand constants
const BRAND = {
  name: "Animalia",
  tagline: "For Pets Who Are Family.",
  colors: {
    primary: "sage green",
    secondary: "warm neutrals, muted gold",
    backgrounds: "white, off-white, cream, light marble",
  },
  aesthetic:
    "Premium, minimalist, clean, warm, natural. Think Aesop meets Whole Foods. " +
    "Design-forward, trust-first, emotionally resonant. Anti-corporate warmth.",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  status: string;
  productType: string;
  vendor: string;
  tags: string[];
  totalInventory: number;
  options: { name: string; values: string[] }[];
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        sku: string;
        price: string;
        selectedOptions: { name: string; value: string }[];
        image: { url: string } | null;
      };
    }[];
  };
  images: {
    edges: {
      node: { id: string; url: string; altText: string | null; width: number; height: number };
    }[];
  };
  featuredImage: { url: string; width: number; height: number } | null;
}

interface ShotTemplate {
  id: string;
  filenameTemplate: string;
  aspect_ratio: string;
  buildPrompt: (ctx: ProductContext) => string;
}

interface ProductContext {
  title: string;
  vendor: string;
  productType: string;
  shortDescription: string;
  physicalDescription: string;
  variants: string[];
  sourceImageUrl: string;
}

// ---------------------------------------------------------------------------
// Shopify API helpers
// ---------------------------------------------------------------------------

async function shopifyAdmin<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const resp = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!resp.ok) {
    throw new Error(`Shopify API ${resp.status}: ${await resp.text()}`);
  }

  const json = await resp.json();
  if (json.errors) {
    throw new Error(`GraphQL: ${json.errors.map((e: any) => e.message).join(", ")}`);
  }
  return json.data;
}

async function fetchProduct(handleOrId: string): Promise<ShopifyProduct> {
  const isNumericId = /^\d+$/.test(handleOrId);

  if (isNumericId) {
    const data = await shopifyAdmin<{ product: ShopifyProduct }>(
      `query($id: ID!) {
        product(id: $id) { ${PRODUCT_FIELDS} }
      }`,
      { id: `gid://shopify/Product/${handleOrId}` }
    );
    if (!data.product) throw new Error(`Product not found: ${handleOrId}`);
    return data.product;
  }

  // Search by handle
  const data = await shopifyAdmin<{ products: { edges: { node: ShopifyProduct }[] } }>(
    `query($query: String!) {
      products(first: 1, query: $query) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }`,
    { query: `handle:${handleOrId}` }
  );

  if (!data.products.edges.length) {
    throw new Error(`Product not found with handle: ${handleOrId}`);
  }
  return data.products.edges[0].node;
}

const PRODUCT_FIELDS = `
  id title handle description descriptionHtml status productType vendor tags
  totalInventory
  options { name values }
  variants(first: 100) {
    edges {
      node {
        id title sku price
        selectedOptions { name value }
        image { url }
      }
    }
  }
  images(first: 20) {
    edges { node { id url altText width height } }
  }
  featuredImage { url width height }
`;

async function uploadImageToProduct(productNumericId: string, filePath: string, alt: string, position: number): Promise<boolean> {
  const data = fs.readFileSync(filePath);
  const base64 = data.toString("base64");
  const filename = path.basename(filePath);

  const resp = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_VERSION}/products/${productNumericId}/images.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        image: { attachment: base64, filename, alt, position },
      }),
    }
  );

  if (!resp.ok) {
    console.error(`   Upload failed (${resp.status}): ${(await resp.text()).substring(0, 200)}`);
    return false;
  }

  const result = await resp.json();
  console.log(`   Uploaded → Shopify image ${result.image.id}`);
  return true;
}

// ---------------------------------------------------------------------------
// Product context builder
// ---------------------------------------------------------------------------

function buildProductContext(product: ShopifyProduct): ProductContext {
  const cleanDesc = product.description
    .replace(/\s+/g, " ")
    .trim()
    .split(".")
    .slice(0, 3)
    .join(".")
    .trim();

  const variantNames = product.variants.edges.map((e) => e.node.title).filter((t) => t !== "Default Title");

  const physicalDescription = inferPhysicalDescription(product);

  return {
    title: product.title,
    vendor: product.vendor,
    productType: product.productType,
    shortDescription: cleanDesc,
    physicalDescription,
    variants: variantNames,
    sourceImageUrl: product.featuredImage?.url || product.images.edges[0]?.node.url || "",
  };
}

function inferPhysicalDescription(product: ShopifyProduct): string {
  const title = product.title.toLowerCase();
  const desc = product.description.toLowerCase();
  const type = product.productType.toLowerCase();

  const parts: string[] = [];

  if (desc.includes("oil") || title.includes("oil")) {
    parts.push("retail bottle of pet wellness oil with printed label");
  } else if (desc.includes("chew") || title.includes("chew")) {
    parts.push("resealable stand-up pouch bag containing soft chew supplements");
  } else if (desc.includes("powder") || title.includes("powder")) {
    parts.push("container of supplement powder");
  } else if (desc.includes("capsule") || title.includes("capsule")) {
    parts.push("bottle of supplement capsules");
  } else if (desc.includes("treat") || title.includes("treat")) {
    parts.push("bag of pet treats");
  } else if (type.includes("supplement")) {
    parts.push("pet supplement product in retail packaging");
  } else {
    parts.push("pet wellness product in retail packaging");
  }

  if (product.featuredImage) {
    const { width, height } = product.featuredImage;
    if (width === height) parts.push("square product image on white background");
    else if (width > height) parts.push("landscape product image");
    else parts.push("portrait product image");
  }

  return parts.join(". ");
}

// ---------------------------------------------------------------------------
// Prompt engineering — the preservation directive and shot templates
// ---------------------------------------------------------------------------

function buildPreserveDirective(ctx: ProductContext): string {
  return (
    `This is a product photograph of "${ctx.title}" by ${ctx.vendor}. ` +
    `It is a ${ctx.physicalDescription}. ` +
    `CRITICAL DIRECTIVE: The product packaging shown in this image is the SOLE subject. ` +
    `Preserve EVERY detail of the packaging EXACTLY as shown — all printed text, brand name, ` +
    `logos, ingredient lists, colors, typography, graphic elements, and design must remain ` +
    `pixel-perfect, crisp, sharp, and fully legible. Do NOT alter, warp, blur, distort, ` +
    `reimagine, or add to any part of the packaging artwork. The packaging is sacred. ` +
    `This must look like a real photograph of this real product — not an AI rendering.`
  );
}

function buildBrandDirective(): string {
  return (
    `Brand aesthetic: ${BRAND.aesthetic} ` +
    `Color palette: ${BRAND.colors.primary}, ${BRAND.colors.secondary}. ` +
    `Background surfaces: ${BRAND.colors.backgrounds}.`
  );
}

const SHOT_TEMPLATES: ShotTemplate[] = [
  {
    id: "studio-white",
    filenameTemplate: "01-studio-white.png",
    aspect_ratio: "1:1",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright, perfectly centered on a pure white seamless studio background. ` +
      `Clean, even studio lighting from a large overhead softbox. Subtle soft shadow directly beneath the product on the white surface. ` +
      `Nothing else in the frame — only the product and white space. Premium e-commerce product photography. ` +
      `Razor sharp focus across the entire product. No props, no distractions, no additional objects. ` +
      `Photorealistic studio photograph.`,
  },
  {
    id: "hero-banner",
    filenameTemplate: "02-hero-banner.png",
    aspect_ratio: "16:9",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright on a clean white surface, positioned at the left third of a wide frame. ` +
      `The remaining two-thirds of the frame is pure white negative space — designed for text overlay. ` +
      `Large softbox lighting from above and slightly left, casting a soft clean shadow to the right. ` +
      `Ultra-sharp product, pure white background. Minimalist, luxurious, with breathing room. ` +
      `Nothing else in the frame. Premium hero banner product photography. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "warm-marble",
    filenameTemplate: "03-warm-marble.png",
    aspect_ratio: "1:1",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright on a warm white Carrara marble surface with subtle gray veining. ` +
      `The background is a soft warm off-white wall, slightly out of focus. ` +
      `Warm natural side lighting from the left, creating a gentle directional shadow on the marble to the right. ` +
      `No other objects — just the product on marble. Clean, premium, minimal. ` +
      `The product packaging is in perfect sharp focus. Photorealistic product photography. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "sage-backdrop",
    filenameTemplate: "04-sage-backdrop.png",
    aspect_ratio: "4:5",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright and centered on a matte white surface. ` +
      `The background is a smooth, matte, muted dusty sage green wall (not bright, not mint — dusty, earthy sage). ` +
      `Soft diffused studio lighting. A clean subtle shadow beneath the product. ` +
      `The sage green complements the product packaging beautifully. Nothing else in the frame. ` +
      `Elegant, editorial, brand-aligned. The product is the only subject. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "three-quarter-angle",
    filenameTemplate: "05-three-quarter.png",
    aspect_ratio: "1:1",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Show this product from a slight three-quarter angle, rotated approximately 20 degrees, ` +
      `standing on a clean matte white surface against a pure white background. ` +
      `This angle reveals more dimension and shape of the product packaging. ` +
      `Professional studio lighting with key light from upper-left, subtle fill from the right. ` +
      `Clean shadow on surface. No props. Just the product at a flattering angle, sharp and detailed. ` +
      `Photorealistic studio product photography.`,
  },
  {
    id: "elevated-display",
    filenameTemplate: "06-elevated-display.png",
    aspect_ratio: "4:5",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright on a small, clean white cylindrical pedestal (approximately 15cm tall) ` +
      `against a soft warm cream background. The pedestal elevates the product, giving it a premium, ` +
      `museum-exhibition quality display feeling. Soft even lighting from above, gentle shadow beneath the pedestal. ` +
      `Minimal, architectural, luxurious. The product is elevated and honored as the sole subject. ` +
      `No other objects. Photorealistic product photography. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "natural-linen",
    filenameTemplate: "07-natural-linen.png",
    aspect_ratio: "1:1",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing on a natural oatmeal-colored linen fabric surface. ` +
      `The background is soft, warm, slightly blurred cream/beige. ` +
      `Warm natural window light from the right side, creating soft directional shadows. ` +
      `The linen texture adds organic warmth without competing with the product. ` +
      `No other objects, no props. The feeling is natural, clean, warm, cozy — aligned with a premium ` +
      `pet wellness brand. Product in sharp focus. Photorealistic lifestyle product photography. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "botanical-accent",
    filenameTemplate: "08-botanical-accent.png",
    aspect_ratio: "1:1",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright on a clean white surface against a white background. ` +
      `Add ONE single small sprig of dried eucalyptus (muted sage green) lying flat on the surface ` +
      `to the lower-right of the product. That single botanical element is the only accent. ` +
      `Soft, bright, airy lighting. The eucalyptus adds a whisper of nature and brand color ` +
      `without competing with the product. The product remains the dominant, sharp, central element. ` +
      `Photorealistic product photography. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "warm-wood",
    filenameTemplate: "09-warm-wood.png",
    aspect_ratio: "16:9",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright on a warm muted honey-toned wooden surface (light oak or birch). ` +
      `The background is a soft gradient from warm cream to white. Warm, natural directional lighting. ` +
      `The golden wood tone adds warmth and a premium organic feel. ` +
      `Product positioned at center-left with ample negative space to the right. ` +
      `No other objects. Clean, warm, editorial. The product packaging is perfectly sharp and legible. ` +
      `Photorealistic product photography. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "ingredient-story",
    filenameTemplate: "10-ingredient-story.png",
    aspect_ratio: "4:5",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright on a premium light stone counter. ` +
      `Arrange a restrained ingredient scene around it using natural salmon-colored fish oil cues, a small ceramic bowl, a folded sage linen cloth, and botanical accents. ` +
      `This should feel like a premium ingredient story shot for a wellness brand, not a busy flat lay. ` +
      `The product remains the dominant sharp focal point and all packaging text must stay perfectly legible. ` +
      `Soft natural side lighting, calm shadows, elevated editorial styling. ` +
      `${buildBrandDirective()}`,
  },
  {
    id: "counter-display",
    filenameTemplate: "11-counter-display.png",
    aspect_ratio: "4:5",
    buildPrompt: (ctx) =>
      `${buildPreserveDirective(ctx)} ` +
      `Place this product standing upright on a refined cream kitchen counter beside an elegant dog bowl and a neatly folded neutral towel. ` +
      `The styling should communicate a premium daily routine for pet parents. ` +
      `The product is still the main subject and must remain tack sharp, realistic, and fully readable. ` +
      `No text overlays, no extra branded packaging, no clutter. ` +
      `Photorealistic lifestyle product photography with warm natural daylight. ` +
      `${buildBrandDirective()}`,
  },
];

// ---------------------------------------------------------------------------
// Image generation
// ---------------------------------------------------------------------------

async function generateShot(
  template: ShotTemplate,
  ctx: ProductContext,
  outputDir: string
): Promise<string | null> {
  const prompt = template.buildPrompt(ctx);
  const filename = template.filenameTemplate;

  console.log(`\n📸 [${template.id}] ${filename} (${template.aspect_ratio}, 4K)`);

  try {
    const response = await fetch(FAL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_urls: [ctx.sourceImageUrl],
        aspect_ratio: template.aspect_ratio,
        resolution: "4K",
        output_format: "png",
        num_images: 1,
        safety_tolerance: "5",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`   ❌ API ${response.status}: ${error.substring(0, 200)}`);
      return null;
    }

    const result = await response.json();

    if (!result.images?.[0]?.url) {
      console.error(`   ❌ No image returned`);
      return null;
    }

    const imageUrl = result.images[0].url;
    const imageResp = await fetch(imageUrl);
    const buffer = await imageResp.arrayBuffer();

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, Buffer.from(buffer));

    const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(1);
    console.log(`   ✅ Saved (${sizeMB}MB): ${outputPath}`);

    return outputPath;
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const flags = args.filter((a) => a.startsWith("--"));
  const positional = args.filter((a) => !a.startsWith("--"));

  const generateOnly = flags.includes("--generate-only");
  const uploadOnly = flags.includes("--upload-only");
  const dryRun = flags.includes("--dry-run");

  if (!positional.length) {
    console.log("Usage: npx tsx scripts/product-photoshoot.ts <handle-or-id> [flags]");
    console.log("Flags: --generate-only  --upload-only  --dry-run");
    process.exit(1);
  }

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  ANIMALIA — Product Photoshoot Workflow");
  console.log(`  Model: fal-ai/nano-banana-pro/edit | 4K | ${SHOT_TEMPLATES.length} shots`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  // 1. Fetch product
  console.log("▸ Fetching product from Shopify...");
  const product = await fetchProduct(positional[0]);
  console.log(`  ${product.title} (${product.status})`);
  console.log(`  Vendor: ${product.vendor} | Type: ${product.productType}`);
  console.log(`  Variants: ${product.variants.edges.length}`);
  console.log(`  Current images: ${product.images.edges.length}`);

  // 2. Build context
  console.log("\n▸ Building product context...");
  const ctx = buildProductContext(product);
  console.log(`  Physical: ${ctx.physicalDescription}`);
  console.log(`  Description: ${ctx.shortDescription.substring(0, 120)}...`);
  if (ctx.variants.length) console.log(`  Variants: ${ctx.variants.join(", ")}`);

  if (!ctx.sourceImageUrl) {
    console.error("❌ Product has no images. Cannot run image-to-image generation.");
    process.exit(1);
  }

  console.log(`  Source image: ${ctx.sourceImageUrl}`);

  const outputDir = path.join(
    process.cwd(),
    "public",
    "images",
    "photoshoot",
    product.handle
  );

  // 3. Dry run output
  if (dryRun) {
    console.log("\n▸ DRY RUN — prompts that would be sent:\n");
    for (const tmpl of SHOT_TEMPLATES) {
      console.log(`--- ${tmpl.id} (${tmpl.aspect_ratio}) ---`);
      console.log(tmpl.buildPrompt(ctx));
      console.log();
    }
    return;
  }

  // 4. Generate images
  const results: Record<string, string | null> = {};

  if (!uploadOnly) {
    console.log(`\n▸ Generating ${SHOT_TEMPLATES.length} shots @ 4K...`);
    console.log(`  Est cost: ~$${(SHOT_TEMPLATES.length * 0.30).toFixed(2)}`);

    for (const tmpl of SHOT_TEMPLATES) {
      results[tmpl.id] = await generateShot(tmpl, ctx, outputDir);
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Save manifest
    const manifest = {
      product: { id: product.id, title: product.title, handle: product.handle },
      vendor: product.vendor,
      productType: product.productType,
      model: "fal-ai/nano-banana-pro/edit",
      resolution: "4K",
      generated: new Date().toISOString(),
      sourceImage: ctx.sourceImageUrl,
      context: {
        physicalDescription: ctx.physicalDescription,
        shortDescription: ctx.shortDescription,
        variants: ctx.variants,
      },
      shots: SHOT_TEMPLATES.map((t) => ({
        id: t.id,
        filename: t.filenameTemplate,
        aspect_ratio: t.aspect_ratio,
        path: results[t.id],
      })),
    };

    fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));

    const ok = Object.values(results).filter(Boolean).length;
    const fail = Object.values(results).filter((r) => !r).length;
    console.log(`\n▸ Generation: ${ok} succeeded, ${fail} failed`);
  }

  // 5. Upload to Shopify
  if (!generateOnly) {
    console.log("\n▸ Uploading images to Shopify...");

    const productNumericId = product.id.replace("gid://shopify/Product/", "");
    const existingImageCount = product.images.edges.length;
    let uploadCount = 0;

    for (let i = 0; i < SHOT_TEMPLATES.length; i++) {
      const tmpl = SHOT_TEMPLATES[i];
      const filePath = path.join(outputDir, tmpl.filenameTemplate);

      if (!fs.existsSync(filePath)) {
        console.log(`   ⏭️  ${tmpl.filenameTemplate} — not found, skipping`);
        continue;
      }

      const alt = `${product.title} — ${tmpl.id.replace(/-/g, " ")}`;
      const position = existingImageCount + uploadCount + 1;

      console.log(`   📤 ${tmpl.filenameTemplate}...`);
      const ok = await uploadImageToProduct(productNumericId, filePath, alt, position);
      if (ok) uploadCount++;

      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log(`\n   Uploaded ${uploadCount} images to product ${product.title}`);
  }

  // Summary
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("  WORKFLOW COMPLETE");
  console.log(`  Product: ${product.title}`);
  console.log(`  Output:  ${outputDir}`);
  console.log("═══════════════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
