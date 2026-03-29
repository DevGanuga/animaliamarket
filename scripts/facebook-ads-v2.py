#!/usr/bin/env python3
"""
Generate higher-fidelity Facebook static ads for Animalia.

Workflow:
1. Use Nano Banana 2 edit with product source image(s) to generate premium,
   strategically composed lifestyle base scenes.
2. Add crisp typography, CTA, and mobile-first layout locally via SVG + ImageMagick.

Usage:
  set -a && source .env.local && python3 scripts/facebook-ads-v2.py
"""

from __future__ import annotations

import json
import os
import ssl
import subprocess
import textwrap
import urllib.request
from pathlib import Path

import certifi


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "ads" / "facebook-v2"
TMP_DIR = OUTPUT_DIR / "_tmp"

FAL_KEY = os.getenv("FAL_KEY") or os.getenv("FAL_API_KEY")
FAL_ENDPOINT = "https://fal.run/fal-ai/nano-banana-2/edit"

FONT_SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
FONT_SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"

CREAM = "#F7F2E8"
STONE = "#23312C"
SAGE = "#6F8B78"
LIGHT_SAGE = "#DDE7DD"
GOLD = "#B9975B"

BRAND_RULES = (
    "Animalia is a premium but warm pet wellness brand. The visual language should feel calmer, smarter, and more trusted than a noisy big-box pet store. "
    "Avoid cartoon aesthetics, gimmicky discount-store energy, sterile pharma vibes, or luxury-for-luxury's-sake styling. "
    "Everything should feel like a real DTC performance ad for a sophisticated wellness brand."
)

GLOBAL_SCENE_RULES = (
    "The product packaging is sacred and must remain exactly accurate, fully legible, undistorted, and realistically photographed. "
    "Do not rebrand, redraw, relabel, simplify, or blur the packaging. "
    "Do not add any text into the generated image. "
    "Do not add fake badges, fake stars, UI chrome, fake ad interface, fake bottles, or extra branded packaging. "
    "Use mobile-first composition for a 4:5 Meta feed ad with the product large enough to read on a phone. "
    "Reserve clean negative space in the upper third for headline/subhead overlay. "
    "Keep backgrounds simple and premium, with believable home or kitchen contexts and natural light."
)

SCENE_RULES_V3 = (
    "Reproduce the provided product packaging exactly as it appears, with no alterations to branding, labels, or design. "
    "Do not generate any text, badges, UI elements, or overlays in the image. "
    "Composition: 4:5 aspect ratio. Product occupies roughly 35-50% of the frame and is fully legible on a phone screen. "
    "Leave the top 30% of the frame as clean negative space for text overlay to be added later. "
    "No additional products, bottles, or packages beyond what is specified."
)

ADS = [
    {
        "id": "omega-daily-add-on",
        "filename": "fb2-omega-daily-add-on-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/028029173215.jpg?v=1764936157",
        ],
        "audience_state": "problem-aware dog owners who want an easy daily wellness add-on, not a complex supplement regimen",
        "pain_trigger": "their dog's coat looks dull, mobility is not what it used to be, or they want one simple routine upgrade",
        "promise": "a simple daily omega habit that feels easy, premium, and worth repeating",
        "proof_mechanism": "the bottle should feel physically present, trusted, and at-home in a real daily feeding setup",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided Alaska Naturals salmon oil bottle. "
            "Show the bottle on a refined cream stone kitchen counter near an elegant dog bowl, subtle natural ingredient cues, and morning light coming from the side. "
            "Include a healthy medium-large dog in soft focus nearby, looking relaxed and well cared for. "
            "The bottle should be foregrounded and dominant, with the surrounding scene communicating daily use, trust, and ease."
        ),
        "negative_constraints": (
            "Do not make the bottle tiny. Do not create a cluttered flat lay. Do not make it look like a veterinary clinic or a stock-photo pantry. "
            "Do not add dramatic effects, glowing highlights, or AI fantasy styling."
        ),
        "headline": "One Easy Daily Add-On",
        "subhead": "Wild Alaska omega support for skin, coat and daily wellness.",
        "eyebrow": "For dogs",
        "cta": "Shop omega oils",
    },
    {
        "id": "calming-trigger",
        "filename": "fb2-calming-trigger-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016065.jpg?v=1752533668",
        ],
        "audience_state": "solution-aware dog owners who already know when their dog gets anxious and want a product they can keep on hand",
        "pain_trigger": "fireworks, vet visits, travel days, storms, and stressful routine disruptions",
        "promise": "calming support that fits real life and gives pet parents more peace of mind",
        "proof_mechanism": "the pouch should feel like a real product a thoughtful pet parent keeps visible and ready, not a generic supplement mockup",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided VetriScience Dog Composure pouch. "
            "Show the pouch upright on a refined side table or pedestal in a warm modern living room during late afternoon or evening. "
            "A dog should be resting more calmly beside its owner in the background, suggesting relief without becoming sentimental or cheesy. "
            "The scene should communicate readiness for stressful moments, emotional reassurance, and everyday use."
        ),
        "negative_constraints": (
            "Do not turn this into a dramatic storm scene. Do not use fireworks visuals. Do not make the dog look frightened. Do not create a fake clinical endorsement visual."
        ),
        "headline": "For Fireworks, Travel & Vet Days",
        "subhead": "Fast-acting calming support for stressful moments.",
        "eyebrow": "Stress support",
        "cta": "Shop calming",
    },
    {
        "id": "joint-mobility",
        "filename": "fb2-joint-mobility-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/017030095166.jpg?v=1764935990",
        ],
        "audience_state": "problem-aware dog owners noticing stiffness, slower movement, or aging-related mobility decline",
        "pain_trigger": "their dog no longer moves as freely, gets up slower, or needs more support staying active",
        "promise": "daily mobility support that feels proactive rather than reactive",
        "proof_mechanism": "the product should appear in a lived-in home where an older dog is visibly comfortable and capable",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided Flexadin joint supplement package. "
            "Show the package upright on a premium pedestal or console table in the foreground of a bright upscale living room. "
            "In the mid-background, a senior dog should be walking confidently across the room with calm energy and good posture. "
            "The image should communicate mobility, comfort, and practical wellness, not illness or medical treatment."
        ),
        "negative_constraints": (
            "Do not show the dog limping, looking sick, or receiving treatment. Do not create a hyper-athletic action scene. Keep the feeling premium, believable, and home-based."
        ),
        "headline": "Support Daily Mobility",
        "subhead": "Curated joint wellness for active and senior dogs.",
        "eyebrow": "Mobility support",
        "cta": "Shop joint support",
    },
    {
        "id": "shop-by-need",
        "filename": "fb2-shop-by-need-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/028029173215.jpg?v=1764936157",
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016065.jpg?v=1752533668",
        ],
        "audience_state": "cold or broad traffic that does not know Animalia yet and needs a clear reason to click",
        "pain_trigger": "pet-wellness shopping feels cluttered, hard to trust, and overloaded with options",
        "promise": "Animalia makes it easier to start with the right need instead of digging through a messy catalog",
        "proof_mechanism": "multiple real products curated into one clean scene, with a calm premium home environment and subtle pet presence",
        "scene_direction": (
            "Create a photorealistic DTC marketplace base scene using both provided product packages exactly as shown. "
            "Place them on a premium marble or stone surface in a calm home interior with a dog and cat subtly present in the background. "
            "The products should feel intentionally curated together, with elegant spacing, strong visibility, and clear premium styling. "
            "The scene must communicate clarity, curation, and trust at a glance."
        ),
        "negative_constraints": (
            "Do not create a crowded shelf. Do not show too many products. Do not make it look like a supermarket aisle, trade-show booth, or collage ad."
        ),
        "headline": "Shop by Need, Not by Clutter",
        "subhead": "Start with calming, joint support and daily wellness.",
        "eyebrow": "Animalia",
        "cta": "Explore Animalia",
    },
    {
        "id": "calm-canine-door-routine",
        "filename": "fb2-calm-canine-door-routine-05.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016065.jpg?v=1752533668",
        ],
        "audience_state": "problem-aware dog owners who know stressful moments are often predictable and want calming support they can keep ready at home",
        "pain_trigger": "vet days, guests coming over, travel, storms, and other routine disruptions that create anticipatory stress",
        "promise": "a practical calm routine that starts before the stressful moment begins",
        "proof_mechanism": "the pouch should feel like something a thoughtful pet parent keeps within reach near the door or daily routine items, not hidden away like a backup product",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided VetriScience Dog Composure pouch. "
            "Show the pouch upright on a refined entryway console or warm mudroom bench with a leash, keys, or a neatly folded dog towel nearby. "
            "In soft focus, a calm dog and owner should appear ready to leave the house, suggesting preparation for real life moments like vet visits or travel. "
            "The scene should communicate readiness, calm control, and premium everyday use."
        ),
        "negative_constraints": (
            "Do not make the setting messy or chaotic. Do not show a frightened dog, dramatic weather, or a veterinary clinic. Do not let props overpower the pouch."
        ),
        "headline": "Keep It By The Door",
        "subhead": "Calming support for vet days, guests and stressful routine changes.",
        "eyebrow": "Calm canine",
        "cta": "Shop Calm Canine",
    },
    {
        "id": "calm-canine-before-stress",
        "filename": "fb2-calm-canine-before-stress-06.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016065.jpg?v=1752533668",
        ],
        "audience_state": "solution-aware dog owners who do not want to wait until their dog is already overwhelmed",
        "pain_trigger": "stressful moments tend to escalate quickly once guests arrive, travel starts, or the routine changes",
        "promise": "calming support that feels proactive, emotionally intelligent, and easy to keep in the routine",
        "proof_mechanism": "the pouch should feel like part of a calm evening home routine where the dog is already settled rather than spiraling",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided VetriScience Dog Composure pouch. "
            "Show the pouch upright on a premium coffee table or side table in a softly lit evening living room. "
            "In the background, a dog should be calmly settled while subtle hints of visitors or a changing routine are present, such as a coat on a chair or an open tote bag, without becoming busy. "
            "The scene should communicate proactive support before stress builds."
        ),
        "negative_constraints": (
            "Do not create a party scene, dramatic motion, or clutter. Do not show the dog distressed. Do not make the pouch tiny or partially hidden."
        ),
        "headline": "Before The Stress Starts",
        "subhead": "Support calmer nights when guests, travel or loud moments are coming.",
        "eyebrow": "Real-life calm support",
        "cta": "Shop Calm Canine",
    },
    {
        "id": "omega-better-bowl",
        "filename": "fb2-omega-better-bowl-05.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/028029173215.jpg?v=1764936157",
        ],
        "audience_state": "problem-aware dog owners who want to improve what goes in the bowl without adding a complicated supplement routine",
        "pain_trigger": "they want an easier way to support skin, coat, and everyday wellness through something they already do every day",
        "promise": "a better bowl that starts with one simple omega pour-over",
        "proof_mechanism": "the bottle should feel like a trusted kitchen staple positioned right where daily feeding happens",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided Alaska Naturals salmon oil bottle. "
            "Show the bottle large and prominent on a premium kitchen island beside a prepared dog meal, with a small visible pour of oil or serving cue that suggests easy everyday use. "
            "A healthy dog should be nearby in soft focus, attentive but calm, reinforcing mealtime routine and trust. "
            "The image should communicate bowl upgrade, habit simplicity, and premium feeding ritual."
        ),
        "negative_constraints": (
            "Do not create a messy cooking scene, flat lay collage, or exaggerated ingredient fantasy. Do not shrink the bottle or obscure the label."
        ),
        "headline": "A Better Bowl Starts Here",
        "subhead": "An easy omega pour-over for skin, coat and everyday wellness.",
        "eyebrow": "Omega support",
        "cta": "Shop omega oils",
    },
    {
        "id": "omega-pour-over-routine",
        "filename": "fb2-omega-pour-over-routine-06.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/028029173215.jpg?v=1764936157",
        ],
        "audience_state": "dog owners who like practical wellness upgrades that feel premium but effortless",
        "pain_trigger": "they want daily support for coat quality and general wellness without pills, powders, or a complicated regimen",
        "promise": "one simple mealtime add-on that makes the routine feel smarter and easier to repeat",
        "proof_mechanism": "the bottle should feel physically present in a believable premium kitchen scene where a daily ritual is already happening",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided Alaska Naturals salmon oil bottle. "
            "Show the bottle on a warm cream stone counter in natural morning light with a plated dog meal, wood serving spoon, and subtle premium kitchen styling. "
            "The dog should be softly present in the background, with the composition emphasizing that omega support slips naturally into the feeding routine. "
            "The scene should feel like a sophisticated direct-response still life for an everyday wellness habit."
        ),
        "negative_constraints": (
            "Do not make the scene look like a stock pantry photo, a veterinary clinic, or a cluttered recipe setup. Do not use dramatic splashes or fake health badges."
        ),
        "headline": "Pour Over A Better Routine",
        "subhead": "Simple daily omega support that fits right into mealtime.",
        "eyebrow": "Daily omega",
        "cta": "Shop omega oils",
    },
    {
        "id": "cosequin-senior-stiff-mornings",
        "filename": "fb2-cosequin-senior-stiff-mornings-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/755970407808.jpg?v=1764935336",
        ],
        "audience_state": "problem-aware senior dog owners noticing slower starts, stiffer mornings, and less comfortable movement",
        "pain_trigger": "their dog still wants the walk and the routine, but getting up and moving looks harder than it used to",
        "promise": "a daily joint-support routine that feels credible, steady, and built for senior dogs",
        "proof_mechanism": "the product should look like a trusted daily staple in a warm home where an older dog is still active and included",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided Cosequin Senior box. "
            "Show the box large and fully legible on a refined wood console or coffee table in a bright upscale living room. "
            "In the background, an older dog should be standing comfortably or beginning a calm walk through the room, with no owner needed. "
            "Keep the scene simple, premium, and believable, emphasizing comfort and routine rather than illness."
        ),
        "negative_constraints": (
            "Do not show limping, treatment, dramatic pain, or veterinary settings. Do not create hyper-athletic motion or clutter the table with too many props."
        ),
        "headline": "For Stiff Mornings",
        "subhead": "Daily joint support for senior dogs starting to slow down.",
        "eyebrow": "Senior mobility",
        "cta": "Shop senior joint",
    },
    {
        "id": "cosequin-more-good-days",
        "filename": "fb2-cosequin-more-good-days-02.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/755970407143.jpg?v=1764935322",
        ],
        "audience_state": "dog owners looking for a credible mobility routine before movement gets noticeably worse",
        "pain_trigger": "less bounce, more hesitation, and signs their dog needs better daily movement support",
        "promise": "a straightforward joint routine that supports more comfortable everyday movement",
        "proof_mechanism": "the box should feel like a veterinarian-trusted wellness product presented in a polished home environment, not a pharmacy shelf",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided Cosequin box. "
            "Show the box upright and dominant on a premium side table near a dog bed or hallway bench, with a healthy adult dog in soft focus nearby. "
            "Use warm neutral tones, natural light, and minimal props so the product remains the hero. "
            "The scene should communicate practical joint care and more good days of movement."
        ),
        "negative_constraints": (
            "Do not create a medical office, stock-pharmacy look, or cluttered supplement display. Do not make the product tiny or partially obscured."
        ),
        "headline": "More Good Days On Their Feet",
        "subhead": "Support daily comfort, movement and mobility.",
        "eyebrow": "Joint support",
        "cta": "Shop joint support",
    },
    {
        "id": "probiotic-better-belly",
        "filename": "fb2-probiotic-better-belly-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016720.jpg?v=1752533690",
        ],
        "audience_state": "problem-aware dog owners dealing with sensitive stomachs, gas, irregular stools, or digestion that gets thrown off easily",
        "pain_trigger": "when digestion is off, feeding, routines, and cleanup all feel harder",
        "promise": "a simple daily gut-support routine that helps the whole day feel steadier",
        "proof_mechanism": "the pouch should feel like part of a calm feeding routine in a real kitchen, not a clinical digestive-health ad",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided VetriScience Probiotic Everyday pouch. "
            "Show the pouch upright and fully legible on a premium kitchen counter beside a clean dog bowl and subtle mealtime cues. "
            "A dog should be softly present in the background, calm and at home, with the overall scene feeling orderly and everyday. "
            "The composition should communicate digestive support through routine, not through medical drama."
        ),
        "negative_constraints": (
            "Do not use bathroom humor, messy feeding scenes, veterinary imagery, or exaggerated symptom storytelling. Keep it clean, premium, and calm."
        ),
        "headline": "A Better Belly Routine",
        "subhead": "Daily probiotic support for dogs with sensitive stomachs.",
        "eyebrow": "Gut support",
        "cta": "Shop gut support",
    },
    # ── V4: Model renders everything ──────────────────────────────
    # No code-generated overlay. The image model renders the full
    # ad creative including text, layout, and design.
    {
        "id": "v4-salmon-6am-flatlay",
        "filename": "fb2-v4-salmon-6am-flatlay-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/028029173215.jpg?v=1764936157",
        ],
        "prompt_v3": (
            "Design a complete 4:5 Facebook ad creative for a pet wellness brand called Animalia. "
            "Use the provided Alaska Naturals Salmon Oil bottle as the product. "
            "\n\nVISUAL CONCEPT: Top-down flat-lay photograph of a morning dog-feeding routine. "
            "The salmon oil bottle lies at a slight angle near the center. Around it: a ceramic dog bowl with kibble "
            "and a golden drizzle of salmon oil on top, a white coffee mug half in frame at one corner, a folded linen napkin. "
            "Shot from directly above on a light grey concrete surface. Cool blue-white morning light, crisp shadows. "
            "No dog, no hands. The composition tells the story through objects arranged like a ritual. "
            "This should feel like an overhead food-magazine photograph. "
            "\n\nTEXT TO RENDER ON THE IMAGE: "
            "In the lower third of the image, render the headline text '6 AM. Same bowl. One thing changed.' in a bold, "
            "elegant serif font, white color, large enough to be the primary visual element after the product. "
            "Below the headline, smaller sans-serif text: 'Wild Alaska salmon oil — the simplest upgrade to their bowl.' "
            "Bottom-right corner: a small pill-shaped button reading 'Shop now' with the URL 'animaliamarket.com' next to it. "
            "The text should feel integrated into the design, not pasted on top. Use subtle drop shadows or a gentle dark gradient "
            "behind the text area to ensure legibility against the flat-lay. "
            "\n\nSTYLE: Clean, modern DTC aesthetic. The overall feel is calm, intentional, premium but not pretentious. "
            "Reproduce the product packaging exactly as provided — do not alter the label."
        ),
        "headline": "6 AM. Same Bowl. One Thing Changed.",
        "subhead": "Wild Alaska salmon oil. The simplest upgrade to their bowl.",
        "eyebrow": "Omega",
        "cta": "Shop now",
        "facebook_copy": {
            "primary_text": (
                "Same bowl. Same kibble. Same routine.\n\n"
                "Except now there's a pour of wild salmon oil on top, and you can see the difference in their coat within two weeks.\n\n"
                "You don't need to overhaul their diet. You don't need a raw food degree. You just need one small thing that actually makes the bowl better.\n\n"
                "Cold-pressed from wild Alaska salmon. One pour. Every morning. That's the whole system."
            ),
            "headline": "6 AM. Same Bowl. One Thing Changed.",
            "description": "Wild Alaska salmon oil for dogs.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v4-composure-30min-closeup",
        "filename": "fb2-v4-composure-30min-closeup-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016065.jpg?v=1752533668",
        ],
        "prompt_v3": (
            "Design a complete 4:5 Facebook ad creative for a pet wellness brand called Animalia. "
            "Use the provided VetriScience Composure calming chews package as the product. "
            "\n\nVISUAL CONCEPT: Dramatic close-up product photograph. "
            "The Composure package is in the right half of the frame, slightly angled, large and legible. "
            "Two or three soft chew treats are scattered in front of it on a dark wood windowsill. "
            "Through the window behind: moody overcast sky, suggestion of rain approaching. "
            "Cool directional light from the window. Shallow depth of field — the rain/sky is soft bokeh, product is tack sharp. "
            "No dog, no person. The mood is contemplative and cinematic: calm before the storm. "
            "\n\nTEXT TO RENDER ON THE IMAGE: "
            "In the upper-left area of the image (where the sky/window is visible), render the headline: "
            "'30 minutes before the storm.' in a bold serif font, white, large and impactful. "
            "Below it in smaller sans-serif: 'Clinically shown to work within 30 min. Lasts up to 4 hours.' "
            "At the very bottom of the frame, a thin dark strip with 'animaliamarket.com' in small white sans-serif. "
            "The text should feel like it belongs in the scene — organic to the moody atmosphere, not like a sticker. "
            "\n\nSTYLE: Editorial, dramatic, cinematic. More like a movie poster for a rainy-day scene than a typical pet ad. "
            "Reproduce the product packaging exactly as provided."
        ),
        "headline": "30 Minutes Before The Storm",
        "subhead": "Clinically shown to work within 30 minutes. Lasts up to 4 hours.",
        "eyebrow": "Calming",
        "cta": "Shop calming chews",
        "facebook_copy": {
            "primary_text": (
                "You can see it coming. The sky changes. The pressure drops. And your dog knows before you do.\n\n"
                "The panting starts. The pacing. The look that says \"something is wrong and I don't know what.\"\n\n"
                "Composure works within 30 minutes. Which means the window isn't after the first thunderclap. It's right now, while the sky is still just grey.\n\n"
                "One chew. 30-minute onset. Up to 4 hours of calm. No drowsiness, no prescription."
            ),
            "headline": "30 Minutes Before The Storm",
            "description": "Fast-acting calming chews for dogs.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v4-cosequin-empty-couch",
        "filename": "fb2-v4-cosequin-empty-couch-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/755970407143.jpg?v=1764935322",
        ],
        "prompt_v3": (
            "Design a complete 4:5 Facebook ad creative for a pet wellness brand called Animalia. "
            "Use the provided Cosequin joint supplement package as the product. "
            "\n\nVISUAL CONCEPT: Wide shot of a lived-in living room. The focus is a large comfortable sofa "
            "with a visible worn impression on one cushion where a dog clearly used to lie — the spot is empty now. "
            "A few stray dog hairs on the fabric. On the coffee table in front: the Cosequin package among everyday items "
            "(a remote, a mug, a book). A dog bed is on the floor nearby — where the dog has relocated because the jump got too hard. "
            "Warm late-afternoon window light. The room is real, not staged. No dog visible. The absence is the story. "
            "\n\nTEXT TO RENDER ON THE IMAGE: "
            "Centered over the empty couch cushion, render in large bold serif font: "
            "'The jump stopped. You barely noticed.' White text with a very subtle dark scrim behind it for legibility. "
            "Below in smaller sans-serif: 'Joint support for the stage before it becomes obvious.' "
            "Bottom center: 'animaliamarket.com' in small text. "
            "The text placement should draw the eye to the empty spot — the headline IS the empty cushion. "
            "\n\nSTYLE: Emotional, quiet, storytelling through absence. This should hit harder than a product hero shot. "
            "The product is discovered, not showcased. Reproduce the packaging exactly as provided."
        ),
        "headline": "The Jump Stopped. You Barely Noticed.",
        "subhead": "Joint support for the stage before it becomes obvious.",
        "eyebrow": "Joint support",
        "cta": "Shop joint support",
        "facebook_copy": {
            "primary_text": (
                "It didn't happen all at once.\n\n"
                "First it was the hesitation. Then the running start. Then one day you looked up and they were on the floor next to the couch instead of on it.\n\n"
                "You didn't see it happen because it happened slowly. And that's exactly why most people start too late.\n\n"
                "Cosequin is the #1 vet-recommended joint supplement brand. Not for dogs that are broken. For dogs that are quietly starting to slow down.\n\n"
                "The earlier you start, the more good days you keep."
            ),
            "headline": "The Jump Stopped. You Barely Noticed.",
            "description": "#1 vet recommended joint supplement.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v4-probiotic-pov-scoop",
        "filename": "fb2-v4-probiotic-pov-scoop-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016720.jpg?v=1752533690",
        ],
        "prompt_v3": (
            "Design a complete 4:5 Facebook ad creative for a pet wellness brand called Animalia. "
            "Use the provided VetriScience Probiotic Everyday pouch as the product. "
            "\n\nVISUAL CONCEPT: First-person POV photograph — the camera IS the pet parent looking down. "
            "On a white kitchen counter: the probiotic pouch standing open, a single soft chew in mid-drop into a stainless steel dog bowl "
            "that already has kibble in it. The viewer's hands are barely visible at the bottom edges of the frame. "
            "A dog's nose and big eyes are just peeking up over the counter edge at the bottom-right corner, looking up at what you're doing. "
            "Natural overhead light. Slightly warm, slightly imperfect — this should feel like a real phone photo of a real morning, not a studio shot. "
            "\n\nTEXT TO RENDER ON THE IMAGE: "
            "Top of the image in clean sans-serif, not too large: 'everything they ate today' as a quiet eyebrow. "
            "Below it, a simple list: '✓ breakfast kibble  ✓ half a dental chew  ✓ something off the floor (unclear)  ✓ one probiotic chew you snuck in' "
            "The last line should be slightly emphasized — bolder or a different color. "
            "Bottom: 'animaliamarket.com' small. "
            "The text should feel casual, almost like a note on your phone, not like an ad headline. "
            "\n\nSTYLE: Warm, honest, slightly funny. The humor comes from every dog parent recognizing themselves. "
            "Reproduce the product packaging exactly."
        ),
        "headline": "Everything They Ate Today",
        "subhead": "Daily probiotic support. One chew. Every bowl.",
        "eyebrow": "Gut health",
        "cta": "Shop now",
        "facebook_copy": {
            "primary_text": (
                "Everything they ate today:\n\n"
                "✓ Breakfast kibble\n"
                "✓ Half a dental chew\n"
                "✓ Something off the kitchen floor (unclear)\n"
                "✓ One probiotic chew you dropped in the bowl before they noticed\n\n"
                "That last one is the only thing keeping the other three from becoming a problem.\n\n"
                "Probiotic Everyday. Duck flavored. They think it's a treat."
            ),
            "headline": "Everything They Ate Today",
            "description": "Daily probiotic chew for dogs.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v4-catcomposure-window",
        "filename": "fb2-v4-catcomposure-window-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664278135.jpg?v=1752533640",
        ],
        "prompt_v3": (
            "Design a complete 4:5 Facebook ad creative for a pet wellness brand called Animalia. "
            "Use the provided VetriScience Cat Composure package as the product. "
            "\n\nVISUAL CONCEPT: Wide cinematic photograph of a quiet room with a large window, golden-hour light streaming in. "
            "A tabby cat sits on the windowsill looking outward, relaxed, tail loosely curled, beautifully backlit. "
            "The cat occupies about a third of the frame and is the emotional center. "
            "The Cat Composure package sits on the windowsill near the cat — visible but not hero-positioned, just part of the scene. "
            "The rest of the room is softly out of focus: a reading chair, a throw blanket, a quiet lived-in space. "
            "Cinematic film-like quality with subtle grain and warm tones. "
            "This should look like a still frame from an indie film, not a pet product ad. "
            "\n\nTEXT TO RENDER ON THE IMAGE: "
            "At the bottom of the image, overlaid on a subtle gradient-to-dark: "
            "Large serif headline: 'Today she chose the window.' "
            "Below in smaller text: 'That\\'s how you know it\\'s working.' "
            "Small URL 'animaliamarket.com' in the bottom corner. "
            "The text should feel like a closing line of a short film — contemplative, not salesy. "
            "\n\nSTYLE: Cinematic, warm, editorial. The ad should make you feel something before you notice it's selling something. "
            "Reproduce the product packaging exactly."
        ),
        "headline": "Today She Chose The Window",
        "subhead": "That's how you know it's working.",
        "eyebrow": "Cat calming",
        "cta": "Shop cat calm",
        "facebook_copy": {
            "primary_text": (
                "You don't measure progress with a nervous cat the way you'd expect.\n\n"
                "It's not that they suddenly love guests. It's not that loud noises stop mattering. "
                "It's smaller than that.\n\n"
                "It's the day they sit in the window instead of behind the dresser. "
                "The evening they stay in the room when someone new comes over. "
                "The first time in weeks you realize you haven't heard them bolt.\n\n"
                "Composure isn't going to fix everything. But the window thing? That's real. And you'll know it when you see it."
            ),
            "headline": "Today She Chose The Window",
            "description": "Calming chews for cats who feel everything.",
            "cta": "Shop Now",
        },
    },
    # ── V5: Pain-point-first, diverse products, marketplace voice ───
    # Animalia is the curator, not the manufacturer. Every ad leads
    # with the pet parent's specific pain point. The product is what
    # we found for them. URL: animalia.market
    {
        "id": "v5-allergy-the-scratch",
        "filename": "fb2-v5-allergy-the-scratch-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664017680_4eb30f74-e945-49a3-8f3f-cd3e6177d766.jpg?v=1752533659",
        ],
        "prompt_v3": (
            "Create a complete 4:5 Facebook ad for the pet wellness marketplace animalia.market. "
            "Use the provided VetriScience Allergy Plus dog supplement package. "
            "\n\nVISUAL: Top-down flat-lay on a warm oak surface. The Allergy Plus package is the anchor, "
            "slightly angled. Around it arrange the objects that tell the story of living with an itchy dog: "
            "a lint roller with visible dog fur on it, a soft grooming brush, a small pile of shed fur, "
            "and a well-loved dog collar. These are the objects a dog-allergy parent sees every single day. "
            "Warm, natural light from one side. Clean composition, editorial feel. "
            "The objects tell the story before anyone reads the text. "
            "\n\nTEXT ON THE IMAGE: "
            "Large bold headline in the lower portion: 'The scratch. The lick. The 3 AM chewing.' "
            "White or cream serif font, large and impactful. "
            "Below it in smaller clean sans-serif: 'Allergy support that actually addresses the cycle — not just the symptoms.' "
            "Bottom corner: 'animalia.market' in small refined text. "
            "The text should feel editorial and integrated, not pasted on. "
            "\n\nSTYLE: Premium flat-lay, warm tones, the kind of image you'd see in a well-designed lifestyle magazine. "
            "Reproduce the product packaging exactly as provided."
        ),
        "headline": "The scratch. The lick. The 3 AM chewing.",
        "subhead": "Allergy support that actually addresses the cycle.",
        "eyebrow": "Dog allergy",
        "cta": "Shop allergy support",
        "facebook_copy": {
            "primary_text": (
                "You know the sound. That rhythmic licking at 2 AM. The scratching that never quite stops. "
                "The hot spots you keep treating that keep coming back.\n\n"
                "Most people treat the symptom. The cream. The cone. The vet visit that ends with 'it might be seasonal.'\n\n"
                "Allergy Plus works from the inside. It supports the immune response that's overreacting to "
                "every pollen, every dust mite, every ingredient they can't tell you about.\n\n"
                "It's not going to fix it overnight. But if you're tired of managing the surface and want to address the cycle? "
                "This is where you start.\n\n"
                "animalia.market — curated wellness for pets who are family."
            ),
            "headline": "The scratch. The lick. The 3 AM chewing.",
            "description": "Allergy support for dogs — animalia.market",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v5-greenies-cat-dental",
        "filename": "fb2-v5-greenies-cat-dental-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/642863114632.jpg?v=1764946168",
        ],
        "prompt_v3": (
            "Create a complete 4:5 Facebook ad for the pet wellness marketplace animalia.market. "
            "Use the provided Greenies Feline Dental Treats package. "
            "\n\nVISUAL: A clean, bright kitchen counter scene. The Greenies package is standing upright, "
            "with a few of the dental treat pieces scattered naturally in front of it. "
            "Next to it: a simple ceramic cat bowl and a small notepad with a pen — suggesting the kind of "
            "person who keeps track of their cat's health. A cat's tail is just visible at the edge of the frame, "
            "the rest of the cat out of shot, creating curiosity. "
            "Bright, airy daylight. White and green tones. Clean and fresh feeling. "
            "\n\nTEXT ON THE IMAGE: "
            "Bold headline in the upper-left area: 'Nobody talks about their teeth until it's a $2,000 vet bill.' "
            "Dark serif font on the bright background, large enough to be the first thing you read. "
            "Below in smaller text: 'A daily dental treat is the cheapest insurance you'll ever buy.' "
            "Bottom: 'animalia.market' small. "
            "The tone should feel like honest, slightly blunt advice from a friend — not a scare tactic. "
            "\n\nSTYLE: Bright, clean, modern. A little clinical but warm. Not a typical pet treat ad. "
            "Reproduce the product packaging exactly as provided."
        ),
        "headline": "Nobody talks about their teeth until it's a $2,000 vet bill.",
        "subhead": "A daily dental treat. The cheapest insurance you'll ever buy.",
        "eyebrow": "Cat dental",
        "cta": "Shop dental care",
        "facebook_copy": {
            "primary_text": (
                "Here's a number nobody wants to hear: 70% of cats show signs of dental disease by age 3.\n\n"
                "And here's the part that actually stings: by the time you notice — the bad breath, "
                "the dropping food, the one-sided chewing — you're looking at an extraction. "
                "Under anesthesia. $1,500 to $3,000.\n\n"
                "A daily dental treat costs about $0.50.\n\n"
                "It's not glamorous. Nobody posts about it. But it's the single cheapest thing you can do "
                "to avoid the most expensive vet visit most cat parents don't see coming.\n\n"
                "Greenies Feline Dental Treats. One a day. That's it.\n\n"
                "animalia.market — curated wellness for pets who are family."
            ),
            "headline": "Nobody talks about their teeth until it's a $2,000 vet bill.",
            "description": "Daily dental treats for cats — animalia.market",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v5-pup-above-real-food",
        "filename": "fb2-v5-pup-above-real-food-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/860008703101-2_f07c240a-0431-4d78-88e8-42877b1d466d.jpg?v=1764937047",
        ],
        "prompt_v3": (
            "Create a complete 4:5 Facebook ad for the pet wellness marketplace animalia.market. "
            "Use the provided A Pup Above Cubies dog food package. "
            "\n\nVISUAL: The A Pup Above package on a wooden cutting board, as if it belongs in a kitchen — "
            "because the food inside is human-grade and that's the point. "
            "A few of the food cubes are scattered on the cutting board, looking genuinely like real food "
            "(visible chunks of chicken, vegetables). Next to the cutting board: a simple chef's knife, "
            "a sprig of fresh herbs, and a clean dog bowl waiting to be filled. "
            "The staging should blur the line between human meal prep and dog meal prep intentionally. "
            "Warm kitchen light, slightly overhead angle, lifestyle food photography style. "
            "\n\nTEXT ON THE IMAGE: "
            "Headline in the lower third: 'Read the back of their bag. Then read this one.' "
            "Bold serif, warm white or cream color, integrated into the scene with a subtle dark gradient behind it. "
            "Smaller text below: 'Human-grade. Whole ingredients. Real food they actually want to eat.' "
            "Bottom: 'animalia.market' small. "
            "\n\nSTYLE: Food photography. This should look like it belongs in Bon Appétit, not a pet aisle. "
            "That's the whole point. Reproduce the product packaging exactly."
        ),
        "headline": "Read the back of their bag. Then read this one.",
        "subhead": "Human-grade. Whole ingredients. Real food they actually want to eat.",
        "eyebrow": "Dog food",
        "cta": "Shop real food",
        "facebook_copy": {
            "primary_text": (
                "Pick up your dog's food bag. Turn it over. Read the ingredients.\n\n"
                "Meat by-product meal. Corn gluten meal. Animal digest. 'Natural flavors' doing a lot of heavy lifting.\n\n"
                "Now read this one: chicken, chicken broth, butternut squash, spinach, blueberries.\n\n"
                "A Pup Above makes human-grade dog food. That means every ingredient meets the same standards "
                "as the food in your fridge. USDA-verified. Not 'inspired by' human food. Actual human food.\n\n"
                "Your dog doesn't know the difference between marketing and ingredients. But their body does.\n\n"
                "animalia.market — curated wellness for pets who are family."
            ),
            "headline": "Read the back of their bag. Then read this one.",
            "description": "Human-grade dog food — animalia.market",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v5-stella-picky-eater",
        "filename": "fb2-v5-stella-picky-eater-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/186011001233-2_44112749-c13f-492d-bef6-6c7bd710efb7.jpg?v=1764949373",
        ],
        "prompt_v3": (
            "Create a complete 4:5 Facebook ad for the pet wellness marketplace animalia.market. "
            "Use the provided Stella & Chewy's Cat Freeze-Dried Chick Chick Chicken Dinner package. "
            "\n\nVISUAL: An editorial, slightly cinematic scene. The Stella & Chewy's bag on a kitchen counter "
            "with a small bowl of the freeze-dried morsels rehydrated and looking like real, appetizing food. "
            "Next to the bowl, an untouched bowl of plain dry kibble — pushed aside, clearly rejected. "
            "The contrast between the two bowls IS the story. One is ignored, one is devoured. "
            "A cat is walking toward the rehydrated bowl, confident, mid-stride. "
            "Warm, inviting kitchen light. The scene should feel like a real kitchen, not a studio. "
            "\n\nTEXT ON THE IMAGE: "
            "Upper portion headline: 'She's not picky. She has standards.' "
            "Elegant serif font, dark color against the bright kitchen. "
            "Smaller text: 'Freeze-dried raw. Real chicken. Zero fillers. The food she actually finishes.' "
            "Bottom: 'animalia.market' small. "
            "The tone is knowing, slightly wry — the ad is on the cat's side. "
            "\n\nSTYLE: Warm editorial photography. The ad respects the cat's intelligence. "
            "Reproduce the product packaging exactly."
        ),
        "headline": "She's not picky. She has standards.",
        "subhead": "Freeze-dried raw. Real chicken. Zero fillers. The food she actually finishes.",
        "eyebrow": "Cat nutrition",
        "cta": "Shop cat food",
        "facebook_copy": {
            "primary_text": (
                "You've tried four brands. You've mixed in toppers. You've warmed it up, added water, "
                "tried the fancy pâté that costs more per ounce than your lunch.\n\n"
                "She sniffed it. Walked away. Looked at you like you should have known better.\n\n"
                "Here's the thing — she's not broken. She's not difficult. She just knows the difference "
                "between processed filler and actual food.\n\n"
                "Stella & Chewy's freeze-dried raw is real chicken, minimally processed, "
                "rehydrated in 3 minutes. It smells like food because it is food.\n\n"
                "The bowl gets finished. Every time. That's not a marketing claim, that's what happens "
                "when you stop trying to trick a cat and start respecting what they actually want.\n\n"
                "animalia.market — curated wellness for pets who are family."
            ),
            "headline": "She's not picky. She has standards.",
            "description": "Freeze-dried raw cat food — animalia.market",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v5-perio-dental-powder",
        "filename": "fb2-v5-perio-dental-powder-01.png",
        "skip_overlay": True,
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664198853_ea8aa515-5cbe-49dd-b93e-7365b3e984a9.jpg?v=1752533662",
        ],
        "prompt_v3": (
            "Create a complete 4:5 Facebook ad for the pet wellness marketplace animalia.market. "
            "Use the provided VetriScience Perio Dental Powder package. "
            "\n\nVISUAL: Overhead flat-lay on a clean white marble surface. The Perio dental powder container "
            "is the central object. Around it: a small wooden scoop with powder in it, a dog food bowl "
            "with kibble that has a light dusting of the powder sprinkled on top, and a simple dog toothbrush "
            "lying unused beside it — making the visual joke that brushing is the ideal but this is what actually happens. "
            "Bright, clinical but warm lighting. Clean, organized, the kind of image that makes dental care "
            "feel simple instead of overwhelming. "
            "\n\nTEXT ON THE IMAGE: "
            "Bold headline: 'When was the last time you checked their teeth?' "
            "Dark serif font, upper portion of image, direct and slightly confrontational but caring. "
            "Smaller text: 'Sprinkle on food. Daily dental support without the wrestling match.' "
            "Bottom: 'animalia.market' small. "
            "The tone is: we both know you're not brushing their teeth. Here's what you can actually do. "
            "\n\nSTYLE: Clean, bright, flat-lay. Medical confidence meets lifestyle warmth. "
            "Reproduce the product packaging exactly."
        ),
        "headline": "When was the last time you checked their teeth?",
        "subhead": "Sprinkle on food. Daily dental support without the wrestling match.",
        "eyebrow": "Dental care",
        "cta": "Shop dental care",
        "facebook_copy": {
            "primary_text": (
                "Let's be honest. You're not brushing their teeth. Almost nobody is.\n\n"
                "The toothbrush is in the drawer. The finger brush lasted one attempt. "
                "And now you just... hope for the best.\n\n"
                "Meanwhile, plaque builds. Gums recede. And by the time your vet says 'we need to do a dental,' "
                "you're looking at anesthesia and a bill that makes you wish you'd done literally anything sooner.\n\n"
                "Perio Dental Powder goes on their food. You scoop, you sprinkle, you're done. "
                "No wrestling. No prying their mouth open. No guilt.\n\n"
                "It's not as good as brushing. But it's infinitely better than nothing. "
                "And nothing is what most of us are currently doing.\n\n"
                "animalia.market — curated wellness for pets who are family."
            ),
            "headline": "When was the last time you checked their teeth?",
            "description": "Daily dental powder for dogs & cats — animalia.market",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v3-cosequin-still-wants-walk",
        "filename": "fb2-v3-cosequin-still-wants-walk-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/755970407808.jpg?v=1764935336",
        ],
        "prompt_v3": (
            f"{SCENE_RULES_V3} "
            "Photograph the provided Cosequin Senior dog supplement package on a low wood entryway bench next to a leather leash, with late-morning sun coming through a front door with frosted glass. "
            "An older golden retriever stands a step behind, looking toward the door with quiet anticipation. The dog is not sad or sick, just slower, with a graying muzzle and calm eyes. "
            "The emotional tone is: they still want to go. The visual story is the moment before a walk when a senior dog waits for the routine they love. "
            "Background is a simple bright hallway, slightly out of focus. No clutter, no owner hands, no extra products."
        ),
        "headline": "They Still Want The Walk",
        "subhead": "Daily joint support for senior dogs who haven't given up on the routine.",
        "eyebrow": "Senior dogs",
        "cta": "Shop joint support",
        "facebook_copy": {
            "primary_text": (
                "You see it every morning. They get up slower, but they still walk to the door.\n\n"
                "They still look at the leash. They still want to go.\n\n"
                "The hard part isn't watching them slow down. It's knowing they haven't stopped wanting the things they used to do easily.\n\n"
                "Cosequin Senior is daily joint support built for dogs in that in-between stage -- not broken, not fine, just needing a little more help staying comfortable.\n\n"
                "Start the routine before the walk gets shorter."
            ),
            "headline": "They Still Want The Walk",
            "description": "Daily joint support for senior dogs.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v3-probiotic-stomach-off",
        "filename": "fb2-v3-probiotic-stomach-off-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664016720.jpg?v=1752533690",
        ],
        "prompt_v3": (
            f"{SCENE_RULES_V3} "
            "Photograph the provided VetriScience Probiotic Everyday pouch standing upright on a clean white marble kitchen counter. "
            "Next to it, a simple ceramic dog bowl sits empty and clean, with a wooden scoop resting beside it. "
            "A medium-sized dog lies calmly on a kitchen floor in the background, relaxed and unbothered, partially out of frame. "
            "The light is soft natural morning light from a window to the left. The counter is mostly empty. The mood is: quiet morning routine, everything in order. "
            "No mess, no drama, no hands, no extra bottles or supplements."
        ),
        "headline": "When Their Stomach Is Off,\nEverything Is Off",
        "subhead": "A simple daily probiotic for dogs with sensitive digestion.",
        "eyebrow": "Gut health",
        "cta": "Shop gut support",
        "facebook_copy": {
            "primary_text": (
                "You already know the signs. The weird appetite. The middle-of-the-night wake-up. The mornings where everything just feels... off.\n\n"
                "When their stomach is unpredictable, the whole day shifts around it.\n\n"
                "A daily probiotic isn't dramatic. It's not a fix-everything supplement. It just helps digestion stay more consistent so you stop bracing for the bad days.\n\n"
                "Probiotic Everyday is one chew. Duck flavored. Daily. That's it."
            ),
            "headline": "When Their Stomach Is Off, Everything Is Off",
            "description": "Daily gut support for sensitive dogs.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v3-cat-composure-hiding",
        "filename": "fb2-v3-cat-composure-hiding-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664278135.jpg?v=1752533640",
        ],
        "prompt_v3": (
            f"{SCENE_RULES_V3} "
            "Photograph the provided VetriScience Cat Composure package standing on a warm wood dresser or nightstand in a quiet bedroom. "
            "A tabby cat is sitting on the bed nearby, half-turned, watchful but not scared -- the posture of a cat that is on edge but choosing to stay in the room rather than hide. "
            "Soft diffused afternoon light comes from a curtained window. A folded throw blanket and a small plant are the only other elements. "
            "The emotional tone is: the cat is still here, and that matters. The scene should feel like a real moment a cat owner would recognize, not a stock photo of a happy cat. "
            "No carrier, no vet, no toys, no owner in frame."
        ),
        "headline": "They're Not Hiding.\nThat's Progress.",
        "subhead": "Calming support for cats who feel every change in the house.",
        "eyebrow": "Cat calming",
        "cta": "Shop cat calm",
        "facebook_copy": {
            "primary_text": (
                "New furniture. A guest who stays too long. The sound of something they can't identify.\n\n"
                "You know your cat. You know the look. The ears go back, they disappear under the bed, and the whole evening changes.\n\n"
                "Composure isn't going to turn them into a different cat. But on the days where they stay in the room instead of vanishing? That's what progress looks like.\n\n"
                "Calming support for cats who feel everything."
            ),
            "headline": "They're Not Hiding. That's Progress.",
            "description": "Calming support for sensitive cats.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "v3-cosequin-in-between",
        "filename": "fb2-v3-cosequin-in-between-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/755970407143.jpg?v=1764935322",
        ],
        "prompt_v3": (
            f"{SCENE_RULES_V3} "
            "Photograph the provided Cosequin joint supplement package on a low side table next to a worn leather armchair in a warm, lived-in living room. "
            "A medium-large dog is standing nearby, mid-stride between the chair and the hallway, captured in a natural transitional moment of movement. "
            "The dog is not athletic or energetic -- just moving through the room at their own pace with visible but dignified age. "
            "Warm late-afternoon light. Hardwood floor. No owner, no extra products, no clutter. "
            "The emotional tone is: the in-between stage where they're not broken but they're not fine either."
        ),
        "headline": "Not Broken.\nNot Fine Either.",
        "subhead": "Joint support for the in-between stage.",
        "eyebrow": "Joint support",
        "cta": "Shop joint support",
        "facebook_copy": {
            "primary_text": (
                "There's a stage nobody talks about.\n\n"
                "They're not limping. They're not in obvious pain. But the jump onto the couch stopped. The stairs got slower. You started lifting them into the car without thinking about it.\n\n"
                "It's the in-between. And most pet parents wait too long to do something about it because it doesn't look bad enough yet.\n\n"
                "Cosequin is daily joint support for that exact stage. The one where a small routine change can still make a real difference."
            ),
            "headline": "Not Broken. Not Fine Either.",
            "description": "#1 vet recommended joint supplement brand.",
            "cta": "Shop Now",
        },
    },
    {
        "id": "cat-composure-home-feels-off",
        "filename": "fb2-cat-composure-home-feels-off-01.png",
        "image_urls": [
            "https://cdn.shopify.com/s/files/1/0944/8629/8926/files/026664278135.jpg?v=1752533640",
        ],
        "audience_state": "cat owners who know their cat reacts to change, visitors, noise, or disruptions in the home",
        "pain_trigger": "their cat gets edgy, hides more, or acts differently when the home environment changes",
        "promise": "a calmer home routine that helps sensitive cats feel more settled",
        "proof_mechanism": "the package should feel like a thoughtful cat-wellness product in a quiet home scene, with a cat nearby but not stressed",
        "scene_direction": (
            "Create a photorealistic direct-response base scene around the provided VetriScience Cat Composure package. "
            "Show the product large and readable on a warm shelf, side table, or credenza in a softly lit home interior. "
            "A cat should be visible nearby in soft focus, alert but calm, with the scene implying a settled home rather than chaos. "
            "Keep the styling refined, minimal, and more editorial than clinical."
        ),
        "negative_constraints": (
            "Do not show a frightened cat, a carrier, veterinary exam room, or messy household scene. Do not let the cat overpower the product."
        ),
        "headline": "When Home Feels Off",
        "subhead": "Calming support for cats sensitive to noise, guests and change.",
        "eyebrow": "Cat calming",
        "cta": "Shop cat calm",
    },
]


def require_env() -> None:
    if not FAL_KEY:
        raise RuntimeError("Missing FAL_KEY or FAL_API_KEY")


SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())


def post_json(url: str, payload: dict) -> dict:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Key {FAL_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, context=SSL_CONTEXT) as response:
        return json.loads(response.read().decode("utf-8"))


def download(url: str, target: Path) -> None:
    with urllib.request.urlopen(url, context=SSL_CONTEXT) as response:
        target.write_bytes(response.read())


def escape_xml(value: str) -> str:
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


def wrap_lines(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=False)


def build_prompt(ad: dict) -> str:
    if ad.get("prompt_v3"):
        return ad["prompt_v3"]
    return " ".join(
        [
            BRAND_RULES,
            GLOBAL_SCENE_RULES,
            f"Target audience state: {ad['audience_state']}.",
            f"Core pain trigger: {ad['pain_trigger']}.",
            f"Conversion promise: {ad['promise']}.",
            f"Visual proof job: {ad['proof_mechanism']}.",
            ad["scene_direction"],
            ad["negative_constraints"],
            "The final image should feel like the top-performing static from a sophisticated DTC pet-supplement brand: emotionally clear, instantly legible on mobile, premium, and believable.",
        ]
    )


def build_overlay_card(ad: dict, width: int = 1080, height: int = 1350) -> str:
    """Original style: cream card top-left with eyebrow, headline, subhead, button."""
    headline_lines = wrap_lines(ad["headline"], 22)
    sub_lines = wrap_lines(ad["subhead"], 42)

    card_x = 36
    card_y = 36
    card_width = 670
    headline_font_size = 58
    headline_line_height = 66
    sub_font_size = 25
    sub_line_height = 34
    eyebrow_font_size = 22
    button_height = 60
    button_width = max(240, min(340, 18 * len(ad["cta"])))
    card_height = (
        74
        + len(headline_lines) * headline_line_height
        + 18
        + len(sub_lines) * sub_line_height
        + 34
        + button_height
        + 26
    )
    svg_lines = [
        f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">',
        f'  <rect x="{card_x}" y="{card_y}" width="{card_width}" height="{card_height}" rx="28" fill="{CREAM}" fill-opacity="0.94"/>',
        f'  <text x="{card_x + 40}" y="{card_y + 56}" font-family="{FONT_SANS}" font-size="{eyebrow_font_size}" letter-spacing="4" fill="{SAGE}" font-weight="700">{escape_xml(ad["eyebrow"].upper())}</text>',
    ]

    y = card_y + 118
    for line in headline_lines:
        svg_lines.append(
            f'  <text x="{card_x + 40}" y="{y}" font-family="{FONT_SERIF}" font-size="{headline_font_size}" fill="{STONE}" font-weight="700">{escape_xml(line)}</text>'
        )
        y += headline_line_height

    sub_y = y + 6
    for line in sub_lines:
        svg_lines.append(
            f'  <text x="{card_x + 40}" y="{sub_y}" font-family="{FONT_SANS}" font-size="{sub_font_size}" fill="{STONE}" fill-opacity="0.84">{escape_xml(line)}</text>'
        )
        sub_y += sub_line_height

    button_x = card_x + 40
    button_y = card_y + card_height - 86
    svg_lines.extend(
        [
            f'  <rect x="{button_x}" y="{button_y}" width="{button_width}" height="{button_height}" rx="30" fill="{STONE}" fill-opacity="0.97"/>',
            f'  <text x="{button_x + button_width / 2}" y="{button_y + 39}" text-anchor="middle" font-family="{FONT_SANS}" font-size="24" fill="white" font-weight="700">{escape_xml(ad["cta"])}</text>',
            "</svg>",
        ]
    )
    return "\n".join(svg_lines)


def build_overlay_bottom_bar(ad: dict, width: int = 1080, height: int = 1350) -> str:
    """Dark gradient bar across the bottom with headline + subhead. No card."""
    headline_lines = wrap_lines(ad["headline"], 28)
    sub_lines = wrap_lines(ad.get("subhead", ""), 55)

    bar_height = 280
    bar_y = height - bar_height
    svg_lines = [
        f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">',
        "  <defs>",
        f'    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">',
        f'      <stop offset="0%" stop-color="black" stop-opacity="0"/>',
        f'      <stop offset="40%" stop-color="black" stop-opacity="0.55"/>',
        f'      <stop offset="100%" stop-color="black" stop-opacity="0.82"/>',
        "    </linearGradient>",
        "  </defs>",
        f'  <rect x="0" y="{bar_y}" width="{width}" height="{bar_height}" fill="url(#fade)"/>',
    ]

    y = height - 160
    for line in headline_lines:
        svg_lines.append(
            f'  <text x="60" y="{y}" font-family="{FONT_SERIF}" font-size="52" fill="white" font-weight="700">{escape_xml(line)}</text>'
        )
        y += 60

    sub_y = y + 4
    for line in sub_lines:
        svg_lines.append(
            f'  <text x="60" y="{sub_y}" font-family="{FONT_SANS}" font-size="24" fill="white" fill-opacity="0.85">{escape_xml(line)}</text>'
        )
        sub_y += 32

    svg_lines.append("</svg>")
    return "\n".join(svg_lines)


def build_overlay_centered(ad: dict, width: int = 1080, height: int = 1350) -> str:
    """Bold headline centered on the image with a subtle scrim behind it."""
    headline_lines = wrap_lines(ad["headline"], 18)
    sub_lines = wrap_lines(ad.get("subhead", ""), 40)

    block_height = len(headline_lines) * 80 + len(sub_lines) * 38 + 60
    block_y = (height - block_height) // 2

    svg_lines = [
        f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">',
        f'  <rect x="0" y="{block_y - 40}" width="{width}" height="{block_height + 80}" fill="black" fill-opacity="0.35"/>',
    ]

    y = block_y + 70
    for line in headline_lines:
        svg_lines.append(
            f'  <text x="{width // 2}" y="{y}" text-anchor="middle" font-family="{FONT_SERIF}" font-size="68" fill="white" font-weight="700">{escape_xml(line)}</text>'
        )
        y += 80

    sub_y = y + 12
    for line in sub_lines:
        svg_lines.append(
            f'  <text x="{width // 2}" y="{sub_y}" text-anchor="middle" font-family="{FONT_SANS}" font-size="28" fill="white" fill-opacity="0.9">{escape_xml(line)}</text>'
        )
        sub_y += 38

    svg_lines.append("</svg>")
    return "\n".join(svg_lines)


def build_overlay_editorial(ad: dict, width: int = 1080, height: int = 1350) -> str:
    """Minimal editorial: small refined text at the very bottom, like a magazine caption."""
    headline_text = ad["headline"].replace("\n", " ")
    sub_text = ad.get("subhead", "")

    svg_lines = [
        f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">',
        f'  <rect x="0" y="{height - 120}" width="{width}" height="120" fill="black" fill-opacity="0.6"/>',
        f'  <text x="48" y="{height - 72}" font-family="{FONT_SERIF}" font-size="36" fill="white" font-weight="700">{escape_xml(headline_text)}</text>',
        f'  <text x="48" y="{height - 36}" font-family="{FONT_SANS}" font-size="20" fill="white" fill-opacity="0.8">{escape_xml(sub_text)}</text>',
        f'  <text x="{width - 48}" y="{height - 50}" text-anchor="end" font-family="{FONT_SANS}" font-size="20" fill="white" font-weight="600">animaliamarket.com</text>',
        "</svg>",
    ]
    return "\n".join(svg_lines)


def build_overlay_minimal(ad: dict, width: int = 1080, height: int = 1350) -> str:
    """Just a small CTA pill at the bottom-right. The image does the talking."""
    cta_text = ad.get("cta", "Shop now")
    pill_w = max(200, 16 * len(cta_text) + 48)
    pill_h = 52
    pill_x = width - pill_w - 40
    pill_y = height - pill_h - 40

    svg_lines = [
        f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">',
        f'  <rect x="{pill_x}" y="{pill_y}" width="{pill_w}" height="{pill_h}" rx="26" fill="white" fill-opacity="0.95"/>',
        f'  <text x="{pill_x + pill_w / 2}" y="{pill_y + 34}" text-anchor="middle" font-family="{FONT_SANS}" font-size="22" fill="{STONE}" font-weight="700">{escape_xml(cta_text)}</text>',
        "</svg>",
    ]
    return "\n".join(svg_lines)


OVERLAY_BUILDERS = {
    "card": build_overlay_card,
    "bottom_bar": build_overlay_bottom_bar,
    "centered": build_overlay_centered,
    "editorial": build_overlay_editorial,
    "minimal": build_overlay_minimal,
}


def build_overlay(ad: dict, width: int = 1080, height: int = 1350) -> str:
    style = ad.get("overlay_style", "card")
    builder = OVERLAY_BUILDERS.get(style, build_overlay_card)
    return builder(ad, width, height)


def render_final(base_image: Path, ad: dict, out_path: Path) -> None:
    overlay_svg = TMP_DIR / f"{ad['id']}-overlay.svg"
    overlay_png = TMP_DIR / f"{ad['id']}-overlay.png"
    normalized_base = TMP_DIR / f"{ad['id']}-normalized.png"
    overlay_svg.write_text(build_overlay(ad), encoding="utf-8")

    subprocess.run(
        [
            "magick",
            str(base_image),
            "-resize",
            "1080x1350^",
            "-gravity",
            "center",
            "-extent",
            "1080x1350",
            str(normalized_base),
        ],
        check=True,
    )

    subprocess.run(
        [
            "magick",
            "-background",
            "none",
            str(overlay_svg),
            str(overlay_png),
        ],
        check=True,
    )

    subprocess.run(
        [
            "magick",
            str(normalized_base),
            str(overlay_png),
            "-composite",
            str(out_path),
        ],
        check=True,
    )


def generate_base(ad: dict) -> Path:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    base_path = TMP_DIR / f"{ad['id']}-base.png"

    payload = {
        "prompt": build_prompt(ad),
        "image_urls": ad["image_urls"],
        "aspect_ratio": "4:5",
        "output_format": "png",
        "resolution": "4K",
        "safety_tolerance": "3",
        "limit_generations": True,
        "num_images": 1,
        "thinking_level": "high",
        "sync_mode": False,
    }

    result = post_json(FAL_ENDPOINT, payload)
    image_url = result["images"][0]["url"]
    download(image_url, base_path)
    return base_path


def main() -> None:
    selected_ids = set(os.sys.argv[1:])
    require_env()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    manifest_path = OUTPUT_DIR / "manifest.json"
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    else:
        manifest = {"generated": [], "ads": []}

    for ad in ADS:
        if selected_ids and ad["id"] not in selected_ids:
            continue
        print(f"\nGenerating {ad['id']}...")
        print(f"Prompt strategy: {ad.get('audience_state', ad.get('prompt_v3', '')[:80])}")
        base = generate_base(ad)
        out_path = OUTPUT_DIR / ad["filename"]
        if ad.get("skip_overlay"):
            subprocess.run(
                ["magick", str(base), "-resize", "1080x1350^",
                 "-gravity", "center", "-extent", "1080x1350", str(out_path)],
                check=True,
            )
        else:
            render_final(base, ad, out_path)
        manifest["generated"] = [generated_id for generated_id in manifest.get("generated", []) if generated_id != ad["id"]]
        manifest["generated"].append(ad["id"])

        entry = {
            "id": ad["id"],
            "file": str(out_path.relative_to(ROOT)),
            "headline": ad["headline"],
            "subhead": ad["subhead"],
            "cta": ad["cta"],
            "prompt": build_prompt(ad),
        }
        manifest["ads"] = [existing for existing in manifest.get("ads", []) if existing.get("id") != ad["id"]]
        manifest["ads"].append(entry)
        print(f"Saved {out_path}")

    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print("\nDone.")


if __name__ == "__main__":
    main()
