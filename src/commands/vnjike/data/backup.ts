import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
const fs = require('fs');
const https = require('https');
const request = require('request');
const { JSDOM } = require('jsdom');
const jquery = require('jquery');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('vnjikedx', 'org');

export default class backup extends SfdxCommand {
  public static description = messages.getMessage('backupDescription');

  public static examples = [
    `$ vnjike:data:backup --targetusername myOrg@example.com --targetdirectory "$HOME" `
  ];

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    targetdirectory: flags.string({
      required: true,
      char: 'd',
      description: messages.getMessage('targetdirectory')
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
    const targetdirectory = this.flags.targetdirectory;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    try {
      const EXPORT_DATA_URL = '/ui/setup/export/DataExportPage/d';
      const DOWNLOAD_URL = '/servlet/servlet.OrgExport';
      const exportDataURL = conn.instanceUrl + EXPORT_DATA_URL;
      const sessionCookie = `sid=${conn.accessToken};`;
      const ORG_ID = this.org.getOrgId();
      const downloadFile = function (url, cookie, index, cb) {
        console.log(`${(new Date()).toISOString()} ## Downloading file: ${url} ...`);

        //use http() instead of request() (see https://stackoverflow.com/questions/62919127/node-issue-with-request-pipe-and-large-files-error-cannot-create-a-string-lo)
        //request() has a bus regarding large files (Data Export ZIP files weight up to 512 MB)
        let writeStream = fs.createWriteStream(`${targetdirectory}\\backup_${ORG_ID}_${index}.zip`);
        https.get(url,
          {
            gzip: true,
            headers: { Cookie: cookie }
          }
          , function (response) {
            response.pipe(writeStream);
            writeStream.on('finish', function () {
              console.log(`${(new Date()).toISOString()} ## File downloaded.`);
              return cb();
            });
            writeStream.on('error', function (err) {
              console.error(err);
              return 1;
            });
          })
          .on('error', function (err) {
            console.error(err);
            return 1;
          })
          .end();
      };

      const finalCallback = function () {
        console.log(`\n\n${(new Date()).toISOString()} ## Data Export completed.`);
        //return 0;
      }

      const createCallback = function (url, sessionCookie, index, cb) {
        return function () {
          downloadFile(url, sessionCookie, index, cb);
        }
      };

      console.log(`${(new Date()).toISOString()} ## Inspecting Export Data wizard landing page...`);
      request({
        method: 'GET',
        url: exportDataURL,
        headers: { Cookie: sessionCookie }
      }, (err, res, body) => {
        if (err) {
          console.error(err);
          return 1;
        }
        console.log(`${(new Date()).toISOString()} ## Export Data page inspected.`);

        const { window } = new JSDOM(body);
        const $ = jquery(window);

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
          return 1;
        }

        return callbacks[callbacks.length - 1]();
      });

    } catch (err) {
      this.ux.errorJson(err);
    }

    // Return an object to be displayed with --json
    return { orgId: this.org.getOrgId(), outputString: 'success' };
  }
}
