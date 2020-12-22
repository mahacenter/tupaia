/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import {} from 'dotenv/config'; // Load the environment variables into process.env

import { generateTestId } from '@tupaia/database';
import { TestableHttpServer } from '@tupaia/utils';
import { createApp } from '../app';
import { getModels } from './getModels';

export const getAuthorizationHeader = () => {
  const credentials = `${process.env.CLIENT_USERNAME}:${process.env.CLIENT_SECRET}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
};

export class TestableApp extends TestableHttpServer {
  models = null;

  database = null;

  user = {};

  authToken = '';

  constructor() {
    const models = getModels();
    const { database } = models;
    database.generateId = generateTestId;
    const app = createApp(database, models);

    super(app);
    this.models = models;
    this.database = database;
  }

  getDefaultApiVersion = () => 2;

  authenticate = async () => {
    const headers = { authorization: getAuthorizationHeader() };
    const body = {
      emailAddress: 'test.user@tupaia.org',
      password: 'test.password',
      deviceName: 'Test Device',
      installId: 'TEST-4D1AC092-4A3E-9958-C109DC56051A',
      app_version: '999.999.999',
    };
    const response = await this.post('auth', { headers, body });

    this.user = response.body.user;
    this.authToken = response.body.accessToken;
  };

  addOptionsToRequest = (request, { headers, body } = {}) => {
    if (this.authToken) {
      request.set('Authorization', `Bearer ${this.authToken}`);
    }
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => request.set(key, value));
    }
    if (body) {
      request.send(body);
    }
    return request;
  };
}
