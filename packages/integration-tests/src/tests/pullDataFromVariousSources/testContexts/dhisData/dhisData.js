/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import nock from 'nock';
import { DhisApiMock } from '../../../utils';

const DHIS_SERVER_URL = /aggregation\.tupaia\.org/;

const dhisApiMock = new DhisApiMock();

export const setup = () => {
  // No network requests should go across the wire during integration tests
  // Specific mocking behaviour is defined on a per-test-case base
  // dhisApiMock.mockAll();
  dhisApiMock.mockAuthentication();
  // nock(DHIS_SERVER_URL)
  //   .get(/api\/analytic1s/)
  //   .reply(200, { test: 'tet' });

  // nock(/.*/)
  //   .get(/.*/)
  //   .replyWithError('Please mock this network request');
};

export const tearDown = () => {
  // nock.restore();
};
