import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

describe('vnjike:metadata:label:upsert', () => {
  test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest(request => {
      const requestMap = ensureJsonMap(request);
      if (ensureString(requestMap.url).match(/Organization/)) {
        return Promise.resolve({ records: [ { Name: 'Super Awesome Org', TrialExpirationDate: '2018-03-20T23:24:11.000+0000'}] });
      }
      return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['vnjike:metadata:label:upsert', '--targetusername', 'scratch2', '-n', 'apiname', '-v', 'value'])
    .it('runs vnjike:metadata:label:upsert --targetusername test@org.com -n apiname -v value', ctx => {
      expect(ctx.stdout).to.contain('started');
    });
});
