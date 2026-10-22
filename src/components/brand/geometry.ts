/**
 * Single source of truth for the V2G monogram. Used by the React logo and by
 * scripts/brand/generate.ts, which writes the static SVG/PNG brand files.
 *
 * Concept: the right arm of the V rises past the cap height and ends in an
 * arrowhead (growth, forward motion), followed by a geometric "2" and "G"
 * drawn with the same stroke so the three letters read as one mark.
 */
export const MARK_VIEWBOX = '0 4.5 79 47';
export const MARK_ASPECT = 79 / 47;
export const MARK_STROKE = 5.5;

export const MARK_PATHS = {
  v: 'M4 17 L15 47 L28.5 9',
  arrow: 'M21.75 13.29 L28.5 9 L31.03 16.59',
  two: 'M34 29.5 C34 25 37.3 22.5 41 22.5 C44.7 22.5 47.5 25 47.5 28.6 C47.5 31.6 45.7 33.6 43.1 36.1 L34 46 L48 46',
  g: 'M72.55 26.8 A11.5 11.5 0 1 0 75.5 36 L75.5 34.5 L65.5 34.5',
} as const;

export const BRAND_COLORS = {
  blue: '#2858F5',
  violet: '#8546F8',
  cyan: '#20C8F5',
  navy: '#081329',
  ink: '#111827',
} as const;

/** Gradient stops for the mark, in user space so straight strokes still get colour. */
export const MARK_GRADIENT = {
  x1: 4,
  y1: 50,
  x2: 76,
  y2: 8,
  stops: [
    { offset: 0, color: BRAND_COLORS.blue },
    { offset: 0.55, color: BRAND_COLORS.violet },
    { offset: 1, color: BRAND_COLORS.cyan },
  ],
} as const;

/**
 * Lockup alignment. The "2G" of the mark sits on the same baseline as the
 * wordmark and matches its cap height; the V and its arrow rise above.
 * Values are in mark (viewBox) units, measured to the outside of the stroke.
 */
export const MARK_LETTER_TOP = 19.75; // top of the "2" / "G"
export const MARK_BASELINE = 48.75; // bottom of the "2" / "G"
export const MARK_VIEWBOX_TOP = 4.5;
export const MARK_VIEWBOX_BOTTOM = 51.5;
/** Geist Bold cap height as a fraction of the font size. */
export const WORDMARK_CAP_HEIGHT = 0.71;
/** Gap between mark and wordmark, in em of the wordmark size. */
export const LOCKUP_GAP_EM = 0.42;

/** Mark scale (em per mark unit) when paired with a wordmark of 1em. */
export const LOCKUP_SCALE = WORDMARK_CAP_HEIGHT / (MARK_BASELINE - MARK_LETTER_TOP);
