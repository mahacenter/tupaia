/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import merge from 'lodash.merge';

import { createAggregator } from '@tupaia/aggregator';
import { runTestsUsingObjectMethod } from '../utils';
import { testContexts } from './testContexts';

import * as baseTestCases from './testCases';

const getTests = (...testCases) => {
  // Use empty object as first param since `lodash.merge` mutates it
  return Object.values(merge({}, ...testCases));
};

describe('Pull data from various sources', () => {
  const aggregator = createAggregator();

  [
    // Object.values(testContexts).forEach(testContext => {
    testContexts.dhisData,
  ].forEach(testContext => {
    const { setup = () => {}, tearDown = () => {}, testCases = {} } = testContext;

    before(async () => {
      await setup();
    });

    after(async () => {
      await tearDown();
    });

    describe(testContext.description, () => {
      describe('analytics', () => {
        const tests = getTests(baseTestCases.fetchAnalytics, testCases.fetchAnalytics);
        runTestsUsingObjectMethod(tests, aggregator, 'fetchAnalytics');
      });

      describe('data elements', () => {
        const tests = getTests(baseTestCases.fetchDataElements, testCases.fetchDataElements);
        runTestsUsingObjectMethod(tests, aggregator, 'fetchDataElements');
      });

      describe('events', () => {
        const tests = getTests(baseTestCases.fetchEventsTests, testCases.fetchDataElements);
        runTestsUsingObjectMethod(tests, aggregator, 'fetchEvents');
      });
    });
  });
});
