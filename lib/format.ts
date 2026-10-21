export interface CompressionResult {
  filename: string;
  originalName: string;
  mimeType: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  savingsBytes: number;
  savingsPercent: number;
  width: number;
  height: number;
  format: 'webp';
  quality: number;
  url: string;
  thumbnailUrl: string;
}

/**
 * Formats byte size into human readable string (e.g. "2.4 MB", "340 KB")
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
