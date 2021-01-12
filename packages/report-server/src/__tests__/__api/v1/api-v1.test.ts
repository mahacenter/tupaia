/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

// TODO get or GET?

import { TestableApp } from '../TestableApp';
import testGetFetchReport from './fetchReport/get';

describe('report-server API v1', () => {
  const app = new TestableApp();

  describe('fetchReport', () => {
    describe('GET', testGetFetchReport(app));
  });
});
