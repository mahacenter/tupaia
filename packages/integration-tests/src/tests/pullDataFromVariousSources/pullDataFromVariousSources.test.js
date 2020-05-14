/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { createAggregator } from '@tupaia/aggregator';
import { runTestsUsingObjectMethod } from '../utilities';
import { testContexts } from './testContexts';

import {
  fetchAnalytics as fetchAnalyticsTests,
  fetchDataElements as fetchDataElementsTests,
  fetchEvents as fetchEventsTests,
} from './testCases';

describe('Pull data from various sources', () => {
  const aggregator = createAggregator();

  [
    // Object.values(testContexts).forEach(testContext => {
    testContexts.dhisData,
  ].forEach(testContext => {
    before(async () => {
      await testContext.setup();
    });

    describe(testContext.description, () => {
      describe('analytics', () => {
        runTestsUsingObjectMethod(fetchAnalyticsTests, aggregator, 'fetchAnalytics');
      });

      describe('data elements', () => {
        runTestsUsingObjectMethod(fetchDataElementsTests, aggregator, 'fetchDataElements');
      });

      describe('events', () => {
        runTestsUsingObjectMethod(fetchEventsTests, aggregator, 'fetchEvents');
      });
    });
  });
});
