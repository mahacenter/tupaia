import * as dhisData from './dhisData';
import * as tupaiaData from './tupaiaData';

export const testContexts = {
  dhisData: {
    description: 'DHIS data',
    ...dhisData,
  },
  tupaiaData: {
    description: 'Tupaia DB data',
    ...tupaiaData,
  },
};
