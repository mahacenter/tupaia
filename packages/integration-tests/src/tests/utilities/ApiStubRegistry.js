/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import fetchMock from 'fetch-mock';

export class ApiStubRegistry {
  handlers = {};

  add(apiStub) {
    const apiUrl = apiStub.getApiUrl().replace(/\/$/, '');

    Object.entries(apiStub.getHandlers()).forEach(([resource, handler]) => {
      const url = `${apiUrl}/${resource}`;
      if (this.handlers[url]) {
        throw new Error(`A handler for ${url} has already been added!`);
      }

      this.handlers[url] = handler;
    });

    return this;
  }

  fetch(url, query) {
    console.log('fetch');
    const { method } = query;
    return this.handlers[url][method.toLowerCase()](query);
  }

  // mockFetch() {
  //   Object.entries(handlers).forEach(([url, handler]) => {
  //     fetchMock.mock(url, handler());
  //   });
  // }

  // restoreFetch() {}
}
