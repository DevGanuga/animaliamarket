/**
 * AI Image Generation Script for Animalia Storefront
 * Uses fal.ai FLUX 2 Flex model to generate premium pet wellness imagery
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const FAL_API_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY;
const FAL_ENDPOINT = "https://fal.run/fal-ai/flux-2-flex";

interface ImageConfig {
  id: string;
  filename: string;
  prompt: string;
  size: string;
  category: "hero" | "collection" | "lifestyle" | "feature";
}

// Carefully crafted prompts for premium pet wellness brand aesthetic
const IMAGE_CONFIGS: ImageConfig[] = [
  // HERO IMAGES
  {
    id: "hero-main",
    filename: "hero-main.jpg",
    prompt:
      "Elegant lifestyle photograph of a happy golden retriever and a content tabby cat sitting together in a bright, airy modern living room with sage green accents, soft natural morning light streaming through large windows, premium minimalist interior design, shallow depth of field, warm and inviting atmosphere, professional pet photography, 8k quality",
    size: "landscape_16_9",
    category: "hero",
  },
  {
    id: "hero-wellness",
    filename: "hero-wellness.jpg",
    prompt:
      "Serene wellness-inspired photograph of a peaceful labrador retriever lying on a luxurious cream-colored rug, surrounded by natural elements like eucalyptus branches and warm wooden textures, soft diffused lighting, calming sage and earth tones color palette, spa-like atmosphere, premium brand aesthetic, professional photography",
    size: "landscape_16_9",
    category: "hero",
  },

  // DOG COLLECTION IMAGES
  {
    id: "collection-dogs",
    filename: "collection-dogs.jpg",
    prompt:
      "Stunning portrait of a healthy, vibrant border collie with shiny coat running through a sunlit meadow, golden hour lighting, motion blur in background, sharp focus on the dog's joyful expression, professional wildlife photography style, warm amber and green tones, 8k resolution",
    size: "landscape_4_3",
    category: "collection",
  },
  {
    id: "collection-dog-supplements",
    filename: "collection-dog-supplements.jpg",
    prompt:
      "Elegant still life photography of premium pet supplement bottles and treats arranged on a marble surface with fresh herbs, eucalyptus leaves, and natural ingredients scattered artfully around, soft studio lighting, minimalist clean aesthetic, sage green and cream color palette, high-end product photography",
    size: "landscape_4_3",
    category: "collection",
  },
  {
    id: "collection-dog-joint",
    filename: "collection-dog-joint.jpg",
    prompt:
      "Active senior golden retriever happily hiking on a forest trail, dappled sunlight filtering through trees, showcasing vitality and mobility, warm earth tones, professional outdoor pet photography, shallow depth of field, inspirational wellness imagery",
    size: "landscape_4_3",
    category: "collection",
  },
  {
    id: "collection-dog-calming",
    filename: "collection-dog-calming.jpg",
    prompt:
      "Peaceful sleeping dog curled up on a cozy knit blanket in front of a fireplace, soft warm lighting, hygge atmosphere, calming neutral tones with sage green accents, shallow depth of field, professional lifestyle photography, serene and relaxing mood",
    size: "landscape_4_3",
    category: "collection",
  },

  // CAT COLLECTION IMAGES
  {
    id: "collection-cats",
    filename: "collection-cats.jpg",
    prompt:
      "Majestic fluffy Maine Coon cat with striking green eyes sitting elegantly on a velvet cushion, soft diffused window light, luxurious interior setting with plants in background, professional cat portrait photography, creamy bokeh, warm tones",
    size: "landscape_4_3",
    category: "collection",
  },
  {
    id: "collection-cat-supplements",
    filename: "collection-cat-supplements.jpg",
    prompt:
      "Artistic flat lay of premium cat wellness products, treats, and natural ingredients like salmon pieces and herbs on a clean marble surface, botanical elements, soft shadows, minimalist aesthetic, sage and blush pink color palette, high-end editorial style",
    size: "landscape_4_3",
    category: "collection",
  },
  {
    id: "collection-cat-calming",
    filename: "collection-cat-calming.jpg",
    prompt:
      "Content cat peacefully napping in a sunny window seat surrounded by soft cushions and indoor plants, dreamy soft focus, warm afternoon light, cozy modern interior, calming atmosphere, professional lifestyle photography",
    size: "landscape_4_3",
    category: "collection",
  },

  // LIFESTYLE/FEATURE IMAGES
  {
    id: "lifestyle-family",
    filename: "lifestyle-family.jpg",
    prompt:
      "Heartwarming scene of a family with their dog and cat relaxing together in a bright modern living room, natural light, genuine happiness and connection, warm neutral color palette with green accents, lifestyle photography, candid authentic moment",
    size: "landscape_4_3",
    category: "lifestyle",
  },
  {
    id: "lifestyle-outdoor",
    filename: "lifestyle-outdoor.jpg",
    prompt:
      "Dog owner hiking with their energetic Australian Shepherd on a beautiful mountain trail at golden hour, stunning landscape vista, adventure and wellness lifestyle, professional outdoor photography, inspirational and aspirational mood",
    size: "landscape_16_9",
    category: "lifestyle",
  },
  {
    id: "lifestyle-vet-approved",
    filename: "lifestyle-vet-approved.jpg",
    prompt:
      "Friendly veterinarian in a clean modern clinic gently examining a calm golden retriever, professional medical setting with plants, warm lighting, trust and expertise conveyed, clean white and sage green color palette, professional healthcare photography",
    size: "landscape_4_3",
    category: "lifestyle",
  },

  // FEATURE/ABOUT IMAGES
  {
    id: "feature-ingredients",
    filename: "feature-ingredients.jpg",
    prompt:
      "Beautiful overhead shot of natural pet supplement ingredients - salmon oil, turmeric, glucosamine crystals, green-lipped mussel, arranged artistically on a light wooden surface with fresh herbs, clean minimalist food photography style, soft natural lighting",
    size: "square",
    category: "feature",
  },
  {
    id: "feature-quality",
    filename: "feature-quality.jpg",
    prompt:
      "Close-up macro shot of premium pet supplement soft chews in an elegant bowl, showing texture and quality, shallow depth of field, professional product photography, clean background, appetizing and high-end appearance",
    size: "square",
    category: "feature",
  },
  {
    id: "about-story",
    filename: "about-story.jpg",
    prompt:
      "Warm candid photograph of a person lovingly embracing their dog in a cozy home setting, genuine emotional connection, soft window light, intimate and heartfelt moment, natural and authentic, professional lifestyle photography",
    size: "landscape_4_3",
    category: "feature",
  },

  // CATEGORY CARDS
  {
    id: "category-food",
    filename: "category-food.jpg",
    prompt:
      "Premium pet food photography - fresh kibble and natural ingredients beautifully arranged, herbs, vegetables, and protein sources, clean modern food styling, soft studio lighting, appetizing and healthy appearance, high-end brand aesthetic",
    size: "square",
    category: "collection",
  },
  {
    id: "category-treats",
    filename: "category-treats.jpg",
    prompt:
      "Artisanal dog treats arranged in a ceramic bowl on a marble surface, natural ingredients visible, rustic yet premium styling, soft diffused lighting, warm earth tones, professional food photography",
    size: "square",
    category: "collection",
  },
];

async function generateImage(config: ImageConfig): Promise<string | null> {
  console.log(`\n🎨 Generating: ${config.id}`);
  console.log(`   Prompt: ${config.prompt.substring(0, 80)}...`);

  try {
    const response = await fetch(FAL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: config.prompt,
        image_size: config.size,
        enable_prompt_expansion: true,
        num_inference_steps: 32,
        guidance_scale: 4.0,
        output_format: "jpeg",
        safety_tolerance: "3",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`   ❌ API Error: ${error}`);
      return null;
    }

    const result = await response.json();

    if (result.images && result.images[0]?.url) {
      const imageUrl = result.images[0].url;
      console.log(`   ✅ Generated: ${imageUrl}`);

      // Download the image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      // Save to public/images folder
      const outputPath = path.join(
        process.cwd(),
        "public",
        "images",
        config.filename
      );

      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
      console.log(`   💾 Saved: ${outputPath}`);

      return `/images/${config.filename}`;
    }

    return null;
  } catch (error) {
    console.error(`   ❌ Error: ${error}`);
    return null;
  }
}

async function main() {
  console.log("🐾 Animalia Image Generation Script");
  console.log("====================================\n");

  if (!FAL_API_KEY) {
    console.error("❌ FAL_KEY environment variable not set!");
    console.log("   Please set: export FAL_KEY=your-api-key");
    process.exit(1);
  }

  console.log(`📸 Generating ${IMAGE_CONFIGS.length} images...\n`);

  const results: Record<string, string | null> = {};

  for (const config of IMAGE_CONFIGS) {
    const imagePath = await generateImage(config);
    results[config.id] = imagePath;

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Save manifest
  const manifest = {
    generated: new Date().toISOString(),
    images: IMAGE_CONFIGS.map((c) => ({
      id: c.id,
      filename: c.filename,
      path: results[c.id],
      category: c.category,
    })),
  };

  fs.writeFileSync(
    path.join(process.cwd(), "public", "images", "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("\n\n✨ Generation Complete!");
  console.log("========================");
  console.log(`Total: ${IMAGE_CONFIGS.length} images`);
  console.log(
    `Success: ${Object.values(results).filter((r) => r !== null).length}`
  );
  console.log(
    `Failed: ${Object.values(results).filter((r) => r === null).length}`
  );
  console.log("\nImages saved to: public/images/");
  console.log("Manifest saved to: public/images/manifest.json");
}

main().catch(console.error);

