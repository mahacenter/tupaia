import { expect } from 'chai';
import moment from 'moment';

import { getTimezoneNameFromTimestamp } from '../../utilities/datetime';

describe('DateTime', () => {
  it('Should get the correct timezone name from a timestamp', async () => {
    const timestamp = '2019-07-31 06:48:00+13:00';
    const utcOffset = '+13:00';
    const timezones = [
      'Etc/GMT-13',
      'Pacific/Apia',
      'Pacific/Enderbury',
      'Pacific/Fakaofo',
      'Pacific/Tongatapu',
      'Antarctica/McMurdo', // +13 while in DST time.
    ];

    expect(moment.parseZone(timestamp).format('Z')).to.equal(utcOffset);
    expect(getTimezoneNameFromTimestamp(timestamp)).to.be.oneOf(timezones);
  });
});
