import { mkdirSync } from 'fs';

/***
 * Create a temp dir
 */
export function createTmpDir() {
    const currentTimeStamp = Date.now();
    const randomDigit = Math.floor(Math.random() * 10);
    const dirName = 'C:\\Temp\\sfdx_guimini_' + currentTimeStamp + randomDigit;

    mkdirSync(dirName);

    return dirName;

}
