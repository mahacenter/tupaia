/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

/* eslint no-unused-vars: ["error", { "args": "none" }] */

import supertest from 'supertest';

const getVersionedEndpoint = (endpoint, apiVersion) => `/v${apiVersion}/${endpoint}`;

/**
 * @abstract
 */
export class TestableHttpServer {
  /**
   * @type {import('http').Server}
   */
  app = null;

  constructor(app) {
    this.app = app;
  }

  /**
   * Can override in subclasses
   */
  getDefaultApiVersion = () => 1;

  request(verb, endpoint, options, apiVersion = this.getDefaultApiVersion()) {
    const versionedEndpoint = getVersionedEndpoint(endpoint, apiVersion);
    const request = supertest(this.app)[verb](versionedEndpoint);
    return this.addOptionsToRequest(request, options);
  }

  /**
   * Can override in subclasses
   *
   * @param {*} request - mutated
   */
  addOptionsToRequest = (request, options) => request;

  get = (endpoint, options, apiVersion) => this.request('get', endpoint, options, apiVersion);

  post = (endpoint, options, apiVersion) => this.request('post', endpoint, options, apiVersion);

  put = (endpoint, options, apiVersion) => this.request('put', endpoint, options, apiVersion);

  delete = (endpoint, options, apiVersion) => this.request('delete', endpoint, options, apiVersion);
}
