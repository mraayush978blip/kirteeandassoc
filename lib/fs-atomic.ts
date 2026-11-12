import fs from 'fs/promises';
import path from 'path';

/**
 * Writes a file atomically (temp file + rename) so a concurrent reader never sees a
 * half-written/truncated file. Throws on failure so callers can report it honestly.
 */
export async function writeFileAtomic(filePath: string, data: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
  try {
    await fs.writeFile(tmp, data, 'utf-8');
    await fs.rename(tmp, filePath);
  } catch (err) {
    await fs.unlink(tmp).catch(() => undefined);
    throw err;
  }
}
