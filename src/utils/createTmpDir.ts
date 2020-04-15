const fse = require('fs-extra');

/***
 * Create a temp dir
 */
export function createTmpDir() {
    const currentTimeStamp = Date.now();
    const randomDigit = Math.floor(Math.random() * 10);
    const currentDir = process.cwd();
    const dirName = currentDir  + currentTimeStamp + randomDigit;

    fse.mkdirpSync(dirName);

    return dirName;

}
