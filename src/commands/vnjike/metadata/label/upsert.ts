import { Flags } from '@oclif/core';
import { SfCommand, Flags as SfFlags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { createTmpDir } from '../../../../utils/createTmpDir.js';
import gracefulFs from 'graceful-fs';
import compressing from 'compressing';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('vnjikedx', 'org');

export default class VnjikeMetadataLabelUpsert extends SfCommand<AnyJson> {
  public static readonly summary = messages.getMessage('commandDescription');
  public static readonly description = messages.getMessage('commandDescription');

  public static readonly examples = [
    `<%= config.bin %> <%= command.id %> --target-org myOrg@example.com --target-label-name "apiname" --target-label-value "value"`,
    `<%= config.bin %> <%= command.id %> -o myOrg@example.com -n "apiname" -v "value"`
  ];

  public static readonly flags = {
    'target-org': SfFlags.requiredOrg(),
    'target-label-name': Flags.string({
      required: true,
      char: 'n',
      description: messages.getMessage('targetlabelname'),
      summary: messages.getMessage('targetlabelname')
    }),
    'target-label-value': Flags.string({
      required: true,
      char: 'v',
      description: messages.getMessage('targetlabelvalue'),
      summary: messages.getMessage('targetlabelvalue')
    })
  };

  public async run(): Promise<AnyJson> {
    const { flags } = await this.parse(VnjikeMetadataLabelUpsert);
    
    // evaluate entries
    const targetLabelName = flags['target-label-name'];
    const targetLabelValue = flags['target-label-value'];

    // Get the org connection
    const conn = flags['target-org'].getConnection();
    const tmpDir = createTmpDir();

    try {
      console.log('label deployment started');

      // create a file
      let packageContent =
        '<?xml version="1.0" encoding="UTF-8"?>\n<Package xmlns="http://soap.sforce.com/2006/04/metadata">\n<types>\n<members>';
      packageContent += targetLabelName;
      packageContent +=
        '</members>\n<name>CustomLabel</name>\n</types>\n<version>46.0</version>\n</Package>';
      gracefulFs.writeFileSync(tmpDir + '\\package.xml', packageContent);
      gracefulFs.mkdirSync(tmpDir + '\\labels');
      const customLabelContent =
        '<?xml version="1.0" encoding="UTF-8"?>\n<CustomLabels xmlns="http://soap.sforce.com/2006/04/metadata">\n<labels>\n<fullName>' +
        targetLabelName +
        '</fullName>\n<language>en_US</language>\n<protected>false</protected>\n<shortDescription>' +
        targetLabelName +
        '</shortDescription>\n<value>' +
        targetLabelValue +
        '</value>\n</labels>\n</CustomLabels>';

      gracefulFs.writeFileSync(
        tmpDir + '\\labels\\CustomLabels.labels',
        customLabelContent
      );
      const zipFile = tmpDir + '.zip';
      await compressing.zip.compressDir(tmpDir, zipFile);

      const zipStream = gracefulFs.createReadStream(zipFile);
      const result = await conn.metadata.deploy(zipStream, {});

      let done = false;
      let deployResult;

      while (!done) {
        deployResult = await conn.metadata.checkDeployStatus(result.id);
        done = deployResult.done;
        if (!done) {
          console.log('Deployment status: ' + deployResult.status);
          await new Promise(sleep => setTimeout(sleep, 5000));
        }
      }

      // delete temporary directory & file
      gracefulFs.rmSync(tmpDir, { recursive: true, force: true });
      gracefulFs.unlinkSync(zipFile);
      console.log('label deployment finished!');
    } catch (err: any) {
      throw new Error(`Label upsert failed: ${err?.message || 'Unknown error'}`);
    }

    // Return an object to be displayed with --json
    return { orgId: flags['target-org'].getOrgId(), outputString: 'success' };
  }
}
