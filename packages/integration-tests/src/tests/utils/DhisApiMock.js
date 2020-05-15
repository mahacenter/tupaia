/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import nock from 'nock';

export class DhisApiMock {
  static SERVER_URL_REGEX = /aggregation\.tupaia\.org/;

  serverMock = nock(DhisApiMock.SERVER_URL_REGEX);

  mockAuthentication() {
    this.serverMock.post('/uaa/oauth/token').reply({
      token: {
        access_token: 'test_dhisAccessToken',
        token_type: 'bearer',
        refresh_token: 'test_dhisRefreshToken',
        scope: 'ALL',
        expires_at: '2099-05-15T12:00:00.000Z',
      },
    });
  }

  get(...args) {
    return this.serverMock.get(...args);
  }

  mockAll() {
    // No network requests should go across the wire during integration tests
    // Specific mocking behaviour is defined on a per-test-case base
    this.serverMock
      .get(/.*/)
      .replyWithError('Please mock this network request')
      .persist(); // TODO only get?
  }

  restoreAll() {
    this.serverMock.restore();
  }
}
