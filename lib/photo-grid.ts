/**
 * Product photo-grid layouts.
 *
 * ONE source of truth used by BOTH the admin builder and the public product page, so what the
 * admin crops is exactly what visitors see. The layout is chosen by the NUMBER of photos
 * (1-6). Every slot has a fixed crop ratio; photos are cropped to that exact ratio in admin,
 * so nothing is stretched or zoomed on the website.
 */

export type GridRatio = '16:9' | '3:2' | '4:3';

export interface GridSlotSpec {
  /** Columns out of 12 on desktop. */
  span: 4 | 6 | 12;
  ratio: GridRatio;
}

export const MIN_GRID_PHOTOS = 1;
export const MAX_GRID_PHOTOS = 6;

const HALF: GridSlotSpec = { span: 6, ratio: '3:2' };
const THIRD: GridSlotSpec = { span: 4, ratio: '4:3' };

export const GRID_LAYOUTS: Record<number, GridSlotSpec[]> = {
  1: [{ span: 12, ratio: '16:9' }],
  2: [HALF, HALF],
  3: [THIRD, THIRD, THIRD],
  4: [HALF, HALF, HALF, HALF],
  5: [HALF, HALF, THIRD, THIRD, THIRD],
  6: [THIRD, THIRD, THIRD, THIRD, THIRD, THIRD],
};

export function clampGridCount(n: number): number {
  return Math.max(MIN_GRID_PHOTOS, Math.min(MAX_GRID_PHOTOS, Math.round(n) || MIN_GRID_PHOTOS));
}

export function gridLayout(count: number): GridSlotSpec[] {
  return GRID_LAYOUTS[clampGridCount(count)];
}

/** "3:2" -> 1.5 */
export function ratioValue(ratio: string): number {
  const [w, h] = ratio.split(':').map(Number);
  return w > 0 && h > 0 ? w / h : 16 / 9;
}

/** CSS aspect-ratio value, e.g. "3 / 2" */
export function ratioCss(ratio: string): string {
  return ratio.replace(':', ' / ');
}

/** Short plain-language name for a ratio. */
export function ratioShape(ratio: string): string {
  if (ratio === '16:9') return 'wide';
  if (ratio === '3:2') return 'wide-ish';
  return 'slightly wide';
}
