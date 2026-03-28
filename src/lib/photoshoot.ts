import * as fs from "fs";
import * as path from "path";

interface PhotoshootManifest {
  shots?: Array<{
    id: string;
    filename: string;
    path?: string | null;
  }>;
}

export interface PhotoshootImage {
  url: string;
  altText: string;
}

export function getLocalPhotoshootImages(handle: string, title: string): PhotoshootImage[] {
  try {
    const manifestPath = path.join(
      process.cwd(),
      "public",
      "images",
      "photoshoot",
      handle,
      "manifest.json"
    );

    if (!fs.existsSync(manifestPath)) {
      const photoshootDir = path.dirname(manifestPath);
      if (!fs.existsSync(photoshootDir)) return [];

      return fs
        .readdirSync(photoshootDir)
        .filter((filename) => /\.(png|jpg|jpeg|webp)$/i.test(filename))
        .sort()
        .map((filename) => ({
          url: `/images/photoshoot/${handle}/${filename}`,
          altText: `${title} — ${filename.replace(/\.[^.]+$/, "").replace(/-/g, " ")}`,
        }));
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as PhotoshootManifest;
    const shots = manifest.shots || [];

    return shots
      .filter((shot) => Boolean(shot.filename))
      .map((shot) => ({
        url: `/images/photoshoot/${handle}/${shot.filename}`,
        altText: `${title} — ${shot.id.replace(/-/g, " ")}`,
      }));
  } catch (error) {
    console.error("Failed to load local photoshoot images:", error);
    return [];
  }
}
