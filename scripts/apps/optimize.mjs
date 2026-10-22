/**
 * Converts the store artwork of Visa2Grow's own Play Store apps into small
 * WebP files for the website.
 *
 *   node scripts/apps/optimize.mjs
 *
 * Sources are the original store assets in the sibling app repositories
 * (~/Projects/<App>/...). Outputs are committed to public/apps/, so the site
 * build never depends on those folders. Re-run after updating store artwork.
 */
import { mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..', '..');
const projects = resolve(root, '..');
const out = join(root, 'public', 'apps');
mkdirSync(out, { recursive: true });

const SOURCES = {
  numflow: { icon: 'NumFlow/assets/icon.png', feature: 'NumFlow/store-assets/feature-graphic-1024x500.png' },
  numshift: { icon: 'NumShift/store/icon-play-512.png', feature: 'NumShift/store/screenshots/feature-graphic.png' },
  brainrush: { icon: 'BrainRush/store/play/icon-512.png', feature: 'BrainRush/store/play/feature-graphic-1024x500.png' },
  spelt: { icon: 'Spelt/assets/play-icon-512.png', feature: 'Spelt/assets/feature-graphic.png' },
  hangman: { icon: 'Hangman/docs/store/play-icon-512.png', feature: 'Hangman/docs/store/play-feature-1024x500.png' },
  pawpath: { icon: 'PawPath/store-assets/play/icon-512.png', feature: 'PawPath/store-assets/play/feature-graphic-1024x500.png' },
  fitrack: { icon: 'FiTrack/store-assets/play/icon-512.png', feature: 'FiTrack/store-assets/play/feature-graphic-1024x500.png' },
  devcompass: { icon: 'LearnPath/play/icon-512.png', feature: 'LearnPath/play/feature-graphic.png' },
};

let total = 0;
for (const [slug, src] of Object.entries(SOURCES)) {
  const jobs = [
    [src.icon, `${slug}-icon.webp`, 256, 82],
    [src.feature, `${slug}-feature-640.webp`, 640, 78],
    [src.feature, `${slug}-feature-1024.webp`, 1024, 78],
  ];
  for (const [input, name, width, quality] of jobs) {
    const file = join(out, name);
    await sharp(join(projects, input)).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(file);
    total += statSync(file).size;
  }
}
console.log(`wrote ${Object.keys(SOURCES).length * 3} images to public/apps (${Math.round(total / 1024)} KB total)`);
