import {  flags, SfdxCommand } from '@salesforce/command';
import { Messages} from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { createTmpDir } from '../../../../utils/createTmpDir';
const fse = require('fs-extra');
const compressing = require('compressing');
const fs = require('fs');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('vnjikedx', 'org');

export default class Upsert extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ vnjike:metadata:label:upsert --targetusername myOrg@example.com --targetlabelname "apiname" --targetlabelvalue "value"
    $ vnjike:metadata:label:upsert -u myOrg@example.com -n "apiname" -v "value"
  `
  ];

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    targetlabelname: flags.string({
      required: true,
      char: 'n',
      description: messages.getMessage('targetlabelname')
    }),
    targetlabelvalue: flags.string({
      required: true,
      char: 'v',
      description: messages.getMessage('targetlabelvalue')
    })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    // evaluate entries
    const targetlabelname = this.flags.targetlabelname;
    const targetlabelvalue = this.flags.targetlabelvalue;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();
    const tmpDir = createTmpDir();

    try {
      console.log('label deployment started');

      // create a file
      let packageContent =
        '<?xml version="1.0" encoding="UTF-8"?>\n<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n<types>\n<members>';
      packageContent += targetlabelname;
      packageContent +=
        '</members>\n<name>CustomLabel</name>\n</types>\n<version>46.0</version>\n</Package>';
      fs.writeFileSync(tmpDir + '\\package.xml', packageContent);
      fs.mkdirSync(tmpDir + '\\labels');
      const customLabelContent =
        '<?xml version="1.0" encoding="UTF-8"?>\n<CustomLabels xmlns="http://soap.sforce.com/2006/04/metadata">\n<labels>\n<fullName>' +
        targetlabelname +
        '</fullName>\n<language>en_US</language>\n<protected>false</protected>\n<shortDescription>' +
        targetlabelname +
        '</shortDescription>\n<value>' +
        targetlabelvalue +
        '</value>\n</labels>\n</CustomLabels>';

      fs.writeFileSync(
        tmpDir + '\\labels\\CustomLabels.labels',
        customLabelContent
      );
      const zipFile = tmpDir + '.zip';
      await compressing.zip.compressDir(tmpDir, zipFile);

      const zipStream = fs.createReadStream(zipFile);
      const result = await conn.metadata.deploy(zipStream, {});

      let done = false;

      let deployResult;

      while (!done) {
        deployResult = await conn.metadata.checkDeployStatus(result.id);
        done = deployResult.done;
        if (!done) {
          this.ux.log('Deployement status: ' + deployResult.status);
          await new Promise(sleep => setTimeout(sleep, 5000));
        }
      }

      // delete tempory directory & file
      fse.removeSync(tmpDir);
      fs.unlinkSync(zipFile);
      console.log('label deployment finished!');
    } catch (err) {
      this.ux.errorJson(err);
    }

    // Return an object to be displayed with --json
    return { orgId: this.org.getOrgId(), outputString: 'success' };
  }
}
