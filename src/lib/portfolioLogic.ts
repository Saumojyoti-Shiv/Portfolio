/**
 * Pure helper utilities for portfolio wordmark morphing, particle luminance normalization,
 * and pivot detection. Tested via node:test.
 */

/**
 * Computes the intermediate morphed string between sourceWord (e.g. "SAUMOJYOTI")
 * and targetWord (e.g. "PORTFOLIO") at progress step `step`.
 */
export function morphWordStep(sourceWord: string, targetWord: string, step: number): string {
  const revealedCount = Math.floor(step);
  if (revealedCount >= targetWord.length) {
    return targetWord;
  }
  const maxLen = Math.max(sourceWord.length, targetWord.length);
  const chars: string[] = [];
  for (let idx = 0; idx < maxLen; idx++) {
    if (idx < revealedCount) {
      if (idx < targetWord.length) {
        chars.push(targetWord[idx]);
      }
    } else if (idx < sourceWord.length) {
      chars.push(sourceWord[idx]);
    }
  }
  return chars.join('');
}

/**
 * Finds the best pivot character index for the Ballista catapult wordmark animation.
 * Prefers narrow vertical stem characters ('I', 'i', 'l', '1') or falls back to the middle/first index.
 */
export function findPivotIndex(word: string, explicitPivot?: number): number {
  const chars = Array.from(word);
  if (
    typeof explicitPivot === 'number' &&
    Number.isInteger(explicitPivot) &&
    explicitPivot >= 0 &&
    explicitPivot < chars.length &&
    chars[explicitPivot]?.trim()
  ) {
    return explicitPivot;
  }
  // Prefer a vertical stem near the middle if multiple exist, or the first stem
  const stemIndices: number[] = [];
  chars.forEach((ch, idx) => {
    if ('Iil1T'.includes(ch)) {
      stemIndices.push(idx);
    }
  });
  if (stemIndices.length > 0) {
    const mid = (chars.length - 1) / 2;
    stemIndices.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
    return stemIndices[0];
  }
  const firstStem = chars.findIndex((c) => 'Iil1'.includes(c));
  return firstStem === -1 ? 0 : firstStem;
}

/**
 * Smoothstep interpolation between edge0 and edge1.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0 || 1)));
  return t * t * (3 - 2 * t);
}

/**
 * Calculates responsive cell pitch for particle portrait based on anchor width.
 */
export function computeCellPitch(widthPx: number): number {
  return Math.min(6, Math.max(3.5, widthPx / 200));
}

/**
 * Computes luminance from RGBA pixel values (0..255), treating near-white studio background
 * pixels cleanly as transparent background when `maskWhiteBg` is true so cutout portraits
 * on white backgrounds render only the subject in particles.
 */
export function computePixelLuminance(
  r: number,
  g: number,
  b: number,
  a: number,
  isBorderConnectedWhite = false
): number {
  if (a < 15 || isBorderConnectedWhite) return 0;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const alphaNorm = a / 255;
  return lum * alphaNorm;
}
