import { Flags } from '@oclif/core';
import { SfCommand, Flags as SfFlags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import gracefulFs from 'graceful-fs';
import * as https from 'https';
import got from 'got';
import { JSDOM } from 'jsdom';
import jquery from 'jquery';
import path from 'path';

// Initialize Messages with the current plugin directory
const __dirname = path.resolve();
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('vnjikedx', 'org');

export default class VnjikeDataBackup extends SfCommand<AnyJson> {
  public static readonly summary = messages.getMessage('backupDescription');
  public static readonly description = messages.getMessage('backupDescription');

  public static readonly examples = [
    `<%= config.bin %> <%= command.id %> --target-org myOrg@example.com --target-directory "$HOME"`
  ];

  public static readonly flags = {
    'target-org': SfFlags.requiredOrg(),
    'target-directory': Flags.string({
      summary: messages.getMessage('targetdirectory'),
      char: 'd',
      required: true,
    }),
  };

  public async run(): Promise<AnyJson> {
    const { flags } = await this.parse(VnjikeDataBackup);
    
    // evaluate entries
    const targetdirectory = flags['target-directory'];

    // Get the org connection
    const conn = flags['target-org'].getConnection();

    try {
      const EXPORT_DATA_URL = '/ui/setup/export/DataExportPage/d';
      const DOWNLOAD_URL = '/servlet/servlet.OrgExport';
      const exportDataURL = conn.instanceUrl + EXPORT_DATA_URL;
      const sessionCookie = `sid=${conn.accessToken};`;
      const ORG_ID = flags['target-org'].getOrgId();
      const downloadFile = function (url: string, cookie: string, index: number, cb: () => void): void {
        console.log(`${(new Date()).toISOString()} ## Downloading file: ${url} ...`);

        //use http() instead of request() (see https://stackoverflow.com/questions/62919127/node-issue-with-request-pipe-and-large-files-error-cannot-create-a-string-lo)
        //request() has a bus regarding large files (Data Export ZIP files weight up to 512 MB)
        let writeStream = gracefulFs.createWriteStream(`${targetdirectory}\\backup_${ORG_ID}_${index}.zip`);
        https.get(url,
          {
            headers: { Cookie: cookie }
          }
          , function (response: any) {
            response.pipe(writeStream);
            writeStream.on('finish', function () {
              console.log(`${(new Date()).toISOString()} ## File downloaded.`);
              return cb();
            });
            writeStream.on('error', function (err: any) {
              console.error(err);
              return 1;
            });
          })
          .on('error', function (err: any) {
            console.error(err);
            return 1;
          })
          .end();
      };

      const finalCallback = function (): void {
        console.log(`\n\n${(new Date()).toISOString()} ## Data Export completed.`);
        //return 0;
      }

      const createCallback = function (url: string, sessionCookie: string, index: number, cb: () => void): () => void {
        return function () {
          downloadFile(url, sessionCookie, index, cb);
        }
      };

      console.log(`${(new Date()).toISOString()} ## Inspecting Export Data wizard landing page...`);
      
      try {
        const response = await got(exportDataURL, {
          headers: { Cookie: sessionCookie }
        });
        
        console.log(`${(new Date()).toISOString()} ## Export Data page inspected.`);

        const { window } = new JSDOM(response.body);
        const $ = jquery(window) as any;

        let callbacks = [finalCallback];

        let links = $('a.actionLink');
        for (let i = links.length - 1; i >= 0; i--) {
          let href = $(links[i]).attr('href');
          if (href.indexOf(DOWNLOAD_URL) < 0) continue;
          let params = href.split('?')[1];
          let fileUrl = conn.instanceUrl + DOWNLOAD_URL + '?' + params;
          callbacks.push(createCallback(fileUrl, sessionCookie, (i + 1), callbacks[callbacks.length - 1]));
        }

        if (callbacks.length < 2) {
          console.error('No link found: check if export data is available at ' + exportDataURL);
          return { orgId: flags['target-org'].getOrgId(), outputString: 'error' };
        }

        callbacks[callbacks.length - 1]();
      } catch (gotErr: any) {
        console.error('Error fetching export data page:', gotErr.message);
        throw new Error(`Failed to fetch export page: ${gotErr.message}`);
      }

    } catch (err: any) {
      throw new Error(`Backup failed: ${err?.message || 'Unknown error'}`);
    }

    // Return an object to be displayed with --json
    return { orgId: flags['target-org'].getOrgId(), outputString: 'success' };
  }
}
