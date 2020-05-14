import { setup as setupDhisDataTest } from './dhisData/setup';
import { setup as setupTupaiaDataTest } from './tupaiaData/setup';

export const testContexts = {
  dhisData: {
    description: 'DHIS data',
    setup: setupDhisDataTest,
  },
  tupaiaData: {
    description: 'Tupaia DB data',
    setup: setupTupaiaDataTest,
  },
};
