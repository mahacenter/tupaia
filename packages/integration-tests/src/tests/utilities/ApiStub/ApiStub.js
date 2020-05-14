/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

/* eslint-disable class-methods-use-this */

/**
 * @abstract
 */
export class ApiStub {
  /**
   * @abstract
   */
  getApiUrl() {
    throw new Error('Any subclass of ApiStub must implement the "getApiUrl" method');
  }

  /**
   * @abstract
   */
  getHandlers() {
    throw new Error('Any subclass of ApiStub must implement the "getHandlers" method');
  }
}
