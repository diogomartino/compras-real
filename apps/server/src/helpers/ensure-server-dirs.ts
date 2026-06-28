import fs from 'fs/promises';
import path from 'path';
import * as serverPaths from './paths';

const ensureDir = async (path: string) => {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path, { recursive: true });
  }
};

const ensureServerDirs = async () => {
  const pathsList = Object.values(serverPaths);
  const IGNORE_LIST: string[] = [];

  const promises = pathsList.map(async (dir) => {
    if (!dir || typeof dir !== 'string') return;

    const resolvedPath = path.resolve(process.cwd(), dir);
    const extension = path.extname(resolvedPath);

    if (extension || IGNORE_LIST.includes(resolvedPath)) return;

    await ensureDir(resolvedPath);
  });

  await Promise.all(promises);
};

export { ensureDir, ensureServerDirs };
