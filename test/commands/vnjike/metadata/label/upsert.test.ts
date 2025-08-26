import { expect } from 'chai';
import { TestContext } from '@salesforce/core/lib/testSetup';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import VnjikeMetadataLabelUpsert from '../../../../../src/commands/vnjike/metadata/label/upsert';

describe('vnjike metadata label upsert', () => {
  const $$ = new TestContext();
  let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(() => {
    sfCommandStubs = stubSfCommandUx($$);
  });

  afterEach(() => {
    $$.restore();
  });

  it('should run the upsert command', async () => {
    const result = await VnjikeMetadataLabelUpsert.run([
      '--target-org', 'test@org.com', 
      '--target-label-name', 'apiname', 
      '--target-label-value', 'value'
    ]);
    expect(result).to.be.ok;
    expect(result.outputString).to.equal('success');
  });
});
