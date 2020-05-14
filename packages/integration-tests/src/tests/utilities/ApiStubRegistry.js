/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import sinon from 'sinon';

export class ApiStubRegistry {
  handlers = {};

  add(apiStub) {
    Object.entries(apiStub.getHandlers()).forEach(([resource, handler]) => {
      if (this.handlers[resource]) {
        // TODO also use base url
        throw new Error(`${resource} has already been added!`);
      }

      this.handlers[resource] = handler;
    });

    return this;
  }

  /**
   * Returns a stub that can replace the `fetch` method
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
   */
  getSinonFetchStub() {
    return sinon.stub().callsFake((resource, query) => this.handlers[resource](query));
  }
}
