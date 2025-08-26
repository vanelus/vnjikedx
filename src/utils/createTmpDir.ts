import gracefulFs from 'graceful-fs';
import * as path from 'path';

/***
 * Create a temp dir
 */
export function createTmpDir(): string {
    const currentTimeStamp = Date.now();
    const randomDigit = Math.floor(Math.random() * 10);
    const currentDir = process.cwd();
    const dirName = path.join(currentDir, `${currentTimeStamp}${randomDigit}`);

    gracefulFs.mkdirSync(dirName, { recursive: true });

    return dirName;
}
