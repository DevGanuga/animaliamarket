type CollectionSpotlight = {
  handle: string;
  label: string;
  title: string;
  description: string;
  image: string;
};

type ProductSignalInput = {
  title: string;
  description?: string;
  tags?: string[];
  metafields?: Array<{ key: string; value: string } | null>;
};

const COLLECTION_SPOTLIGHTS: CollectionSpotlight[] = [
  {
    handle: "organic-canine-supplements-hip-and-joint",
    label: "Top Seller",
    title: "Dog Joint Support",
    description: "Mobility supplements, chews, oils, and higher-value formats for long-term support.",
    image: "/images/animalia-dog-joint-support.png",
  },
  {
    handle: "calm-feline-supplements",
    label: "Daily Relief",
    title: "Cat Calming",
    description: "Support anxious cats with routines built around daily calm and stress relief.",
    image: "/images/animalia-cat-calming.png",
  },
  {
    handle: "feline-dental-supplements",
    label: "Easy Routine",
    title: "Cat Dental",
    description: "Simple daily options for breath, plaque, and long-term oral care.",
    image: "/images/animalia-dental-routine.png",
  },
  {
    handle: "organic-supplements",
    label: "Wellness Staples",
    title: "Daily Supplements",
    description: "Core wellness support for pet parents building a simple daily routine.",
    image: "/images/animalia-omega-wellness.png",
  },
  {
    handle: "organic-canine-food",
    label: "Everyday Essential",
    title: "Dog Nutrition",
    description: "Premium everyday food and topper options your dog will love.",
    image: "/images/animalia-omega-wellness.png",
  },
  {
    handle: "feline-dry-foods",
    label: "Cat Favorite",
    title: "Cat Dry Food",
    description: "Quality dry food essentials for healthy, happy cats.",
    image: "/images/animalia-cat-calming.png",
  },
  {
    handle: "feline-digestive-supplements",
    label: "Wellness Focus",
    title: "Cat Digestion",
    description: "Digestive support options for cats with sensitive stomachs and daily gut needs.",
    image: "/images/animalia-omega-wellness.png",
  },
];

const PRIORITY_HANDLES = COLLECTION_SPOTLIGHTS.map((spotlight) => spotlight.handle);
const SUSPICIOUS_INGREDIENT_PATTERNS = [
  /acid blue/i,
  /red\s*40/i,
  /yellow\s*5/i,
  /yellow\s*6/i,
  /blue\s*1/i,
  /fd&c/i,
];

function normalize(text?: string) {
  return (text || "").toLowerCase();
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function splitMetafieldValue(value: string) {
  return value
    .split(/\r?\n|•|,|;/)
    .map((item) => item.trim())
    .filter((item) => item.length > 3);
}

function safeMetafields(metafields: ProductSignalInput["metafields"] = []) {
  return metafields.filter(
    (field): field is { key: string; value: string } => Boolean(field)
  );
}

function cleanDescriptionText(description = "") {
  return description
    .replace(/\u2022/g, "\n")
    .replace(/Sold\s+in\s+Qty(?:uantity)?\s+of:\s*\d+/gi, "")
    .replace(/Sold\s+In\s+Quantity\s+of:\s*\d+/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function stripIngredientsAndUsage(description = "") {
  return cleanDescriptionText(description)
    .replace(/ingredients?:[^]+$/i, "")
    .replace(/(directions(?: for use)?|feeding instructions?):[^]+$/i, "")
    .trim();
}

function getSentences(text: string) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function isSuspiciousIngredientText(text: string) {
  const normalized = text.trim();
  if (!normalized) return false;
  return SUSPICIOUS_INGREDIENT_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function prioritizeCollectionHandles(handles: string[]) {
  return [...handles].sort((a, b) => {
    const aIndex = PRIORITY_HANDLES.indexOf(a);
    const bIndex = PRIORITY_HANDLES.indexOf(b);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}

export function getCollectionSpotlight(handle: string, fallbackTitle: string) {
  return (
    COLLECTION_SPOTLIGHTS.find((spotlight) => spotlight.handle === handle) || {
      handle,
      label: "Curated Collection",
      title: cleanCollectionTitle(fallbackTitle),
      description: "Hand-picked products organized to help shoppers solve one clear pet wellness need.",
      image: getCollectionFallbackImage(fallbackTitle),
    }
  );
}

export function cleanCollectionTitle(title: string) {
  return title
    .replace(/Organic\s*/gi, "")
    .replace(/Canine\s*/gi, "Dog ")
    .replace(/Feline\s*/gi, "Cat ")
    .replace(/Supplements?:?\s*/gi, "")
    .replace(/Goods/gi, "Food")
    .replace(/\s+/g, " ")
    .trim();
}

export function getCollectionFallbackImage(title: string) {
  const text = normalize(title);

  if (text.includes("joint") || text.includes("hip")) return "/images/animalia-dog-joint-support.png";
  if (text.includes("calm")) return "/images/animalia-cat-calming.png";
  if (text.includes("dental")) return "/images/animalia-dental-routine.png";
  if (text.includes("food") || text.includes("nutrition")) return "/images/animalia-omega-wellness.png";
  if (text.includes("supplement")) return "/images/animalia-omega-wellness.png";
  if (text.includes("dog") || text.includes("canine")) return "/images/animalia-dog-joint-support.png";
  if (text.includes("cat") || text.includes("feline")) return "/images/animalia-cat-calming.png";

  return "/images/animalia-hero-editorial.png";
}

export function getCollectionSupportCopy(title: string) {
  const text = normalize(title);

  if (text.includes("joint") || text.includes("hip")) {
    return [
      "Best for senior pets, active breeds, and daily mobility support.",
      "Start with larger count or larger bottle formats when this is part of a long-term routine.",
    ];
  }

  if (text.includes("calm")) {
    return [
      "Best for travel, separation stress, thunderstorms, and daily anxiety support.",
      "Shoppers usually respond best to routines they can use consistently, not one-off products.",
    ];
  }

  if (text.includes("dental")) {
    return [
      "Best for daily breath and plaque support with low-friction routines.",
      "Pairs well with food or wellness staples for a complete daily routine.",
    ];
  }

  if (text.includes("digest")) {
    return [
      "Best for daily gut support, sensitive stomachs, and longer-term wellness routines.",
      "Digestive products often pair naturally with food, dental, or skin-and-coat support.",
    ];
  }

  return [
    "Curated to help shoppers compare similar products without sorting through low-signal catalog noise.",
    "Use this collection to push customers toward the clearest fit, not just the cheapest item.",
  ];
}

export function getProductConcernLabel(input: ProductSignalInput) {
  const text = `${normalize(input.title)} ${normalize(input.description)} ${input.tags?.map(normalize).join(" ") || ""}`;

  if (text.includes("salmon oil") || text.includes("pollock oil") || text.includes("omega")) return "Omega support";
  if (text.includes("joint") || text.includes("mobility") || text.includes("hip")) return "Mobility support";
  if (text.includes("calm") || text.includes("anxiety") || text.includes("stress")) return "Calming support";
  if (text.includes("dental") || text.includes("plaque") || text.includes("breath")) return "Dental support";
  if (text.includes("digest") || text.includes("probiotic") || text.includes("gut")) return "Digestive support";
  if (text.includes("skin") || text.includes("coat")) return "Skin and coat support";

  return "Daily wellness";
}


export function getCleanProductDescription(input: ProductSignalInput) {
  const cleaned = stripIngredientsAndUsage(input.description).trim();
  return cleaned || cleanDescriptionText(input.description);
}

export function getProductSummary(input: ProductSignalInput) {
  const text = `${normalize(input.title)} ${normalize(input.description)} ${input.tags?.map(normalize).join(" ") || ""}`;
  const cleaned = stripIngredientsAndUsage(input.description);
  const sentences = getSentences(cleaned);
  const isCat = text.includes("cat") || text.includes("feline");

  if (text.includes("salmon oil") || text.includes("pollock oil") || text.includes("omega")) {
    return `Wild Alaska fish oil for ${isCat ? "cats" : "dogs"} that adds EPA and DHA omega support to a simple daily feeding routine.`;
  }

  if (text.includes("joint") || text.includes("mobility") || text.includes("hip")) {
    return `Daily joint support for ${isCat ? "cats" : "dogs"} focused on comfort, mobility, and long-term routine use.`;
  }

  if (text.includes("calm") || text.includes("anxiety") || text.includes("stress")) {
    return `Calming support designed to help ${isCat ? "cats" : "dogs"} stay more settled during everyday stressors and routine changes.`;
  }

  if (text.includes("dental") || text.includes("plaque") || text.includes("breath")) {
    return `An easy daily dental care option that helps pet parents build a low-friction oral wellness routine.`;
  }

  if (text.includes("digest") || text.includes("probiotic") || text.includes("gut")) {
    return `Digestive support for daily gut balance, sensitive stomachs, and consistent wellness routines.`;
  }

  if (sentences.length > 0) {
    return sentences[0];
  }

  return "A curated wellness product chosen for shoppers who want a clearer fit and a stronger daily routine.";
}

export function getProductOverviewParagraphs(input: ProductSignalInput) {
  const summary = getProductSummary(input);
  const cleaned = stripIngredientsAndUsage(input.description);
  const sentences = getSentences(cleaned).filter((sentence) => sentence !== summary);

  const paragraphs = [summary];
  if (sentences[0]) paragraphs.push(sentences[0]);

  return unique(paragraphs).slice(0, 2);
}

export function getProductUseCases(input: ProductSignalInput) {
  const text = `${normalize(input.title)} ${normalize(input.description)} ${input.tags?.map(normalize).join(" ") || ""}`;

  if (text.includes("salmon oil") || text.includes("pollock oil") || text.includes("omega")) {
    return ["Daily feeding add-on", "Skin and coat support", "Simple wellness boost"];
  }

  if (text.includes("joint") || text.includes("mobility") || text.includes("hip")) {
    return ["Senior pets", "Active breeds", "Daily mobility routine"];
  }

  if (text.includes("calm") || text.includes("anxiety") || text.includes("stress")) {
    return ["Travel days", "Separation stress", "Routine changes"];
  }

  if (text.includes("dental") || text.includes("plaque") || text.includes("breath")) {
    return ["Daily oral care", "Low-friction routine", "Repeat purchase"];
  }

  if (text.includes("digest") || text.includes("probiotic") || text.includes("gut")) {
    return ["Sensitive stomachs", "Daily gut support", "Long-term wellness"];
  }

  return ["Daily wellness", "Routine support", "Curated pick"];
}

export function getProductBenefits(input: ProductSignalInput) {
  const { title, description, tags = [], metafields = [] } = input;
  const text = `${normalize(title)} ${normalize(description)} ${tags.map(normalize).join(" ")}`;
  const benefitsMetafield = safeMetafields(metafields).find((field) => field.key === "benefits")?.value;

  if (benefitsMetafield) {
    return unique(splitMetafieldValue(benefitsMetafield)).slice(0, 3);
  }

  const benefits: string[] = [];

  if (text.includes("salmon oil") || text.includes("pollock oil") || text.includes("omega")) {
    benefits.push("Adds omega support for skin, coat, and everyday wellness.");
    benefits.push("Easy to use as part of a daily feeding routine.");
  }

  if (text.includes("joint") || text.includes("mobility") || text.includes("hip")) {
    benefits.push("Supports daily joint comfort and mobility.");
    benefits.push("A strong fit for aging pets or active routines.");
  }

  if (text.includes("calm") || text.includes("anxiety") || text.includes("stress")) {
    benefits.push("Helps support calmer behavior during daily stressors.");
    benefits.push("Useful for travel, separation, or environmental changes.");
  }

  if (text.includes("dental") || text.includes("plaque") || text.includes("breath")) {
    benefits.push("Supports daily dental care with an easy wellness routine.");
    benefits.push("Perfect for a simple daily oral care routine.");
  }

  if (text.includes("digest") || text.includes("probiotic") || text.includes("gut")) {
    benefits.push("Supports digestive balance and everyday gut health.");
    benefits.push("Works best when used consistently as part of a daily routine.");
  }

  if (text.includes("skin") || text.includes("coat")) {
    benefits.push("Supports healthy skin and coat from the inside out.");
  }

  if (benefits.length === 0 && description) {
    benefits.push("Chosen for shoppers who want a clearer, better-curated wellness option.");
    benefits.push("Designed to fit into a simple daily pet care routine.");
  }

  return unique(benefits).slice(0, 3);
}

export function getProductIngredients(input: ProductSignalInput) {
  const { description = "", metafields = [] } = input;
  const ingredientMetafield = safeMetafields(metafields).find((field) => field.key === "ingredients")?.value;

  if (ingredientMetafield && !isSuspiciousIngredientText(ingredientMetafield)) {
    return splitMetafieldValue(ingredientMetafield).join("\n");
  }

  const match = cleanDescriptionText(description).match(/ingredients?:\s*([^]+?)(?:directions|feeding instructions|sold in qty|$)/i);
  const extracted = match?.[1]?.trim() || "";

  if (!extracted || isSuspiciousIngredientText(extracted)) {
    return "";
  }

  return splitMetafieldValue(extracted).join("\n");
}

export function getProductUsage(input: ProductSignalInput) {
  const { description = "", metafields = [] } = input;
  const usageMetafield = safeMetafields(metafields).find((field) => field.key === "usage")?.value;

  if (usageMetafield) {
    return splitMetafieldValue(usageMetafield).join("\n");
  }

  const match = cleanDescriptionText(description).match(/(directions(?: for use)?|feeding instructions?):\s*([^]+?)(?:ingredients|sold in qty|$)/i);
  return match?.[2]?.trim() || "";
}

export function getFreeShippingCopy(price: number) {
  if (price >= 50) {
    return "This item qualifies for free shipping on its own.";
  }

  return `Add $${(50 - price).toFixed(2)} more to unlock free shipping.`;
}

export function getValueCallout(title: string) {
  const text = normalize(title);
  const ounceMatch = title.match(/(\d+(?:\.\d+)?)\s*oz/i);
  const countMatch = title.match(/(\d+)\s*(?:ct|count|chews|tabs?)/i);

  if (ounceMatch && parseFloat(ounceMatch[1]) >= 16) {
    return "Larger format for households using this daily.";
  }

  if (countMatch && parseInt(countMatch[1], 10) >= 60) {
    return "Higher-count option that fits repeat-use routines well.";
  }

  if (text.includes("travel")) {
    return "Smaller format suited for testing or travel use.";
  }

  return "";
}
