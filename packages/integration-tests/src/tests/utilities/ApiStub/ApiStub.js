/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

/**
 * @abstract
 */
export class ApiStub {
  /**
   * @abstract
   */
  // eslint-disable-next-line class-methods-use-this
  getHandlers() {
    throw new Error('Any subclass of ApiStub must implement the "getHandlers" method');
  }
}
