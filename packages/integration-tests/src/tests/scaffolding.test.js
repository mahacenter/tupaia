/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import moment from 'moment';

import { clearTestData, getTestDatabase } from '@tupaia/database';

const testStartTime = moment().format('YYYY-MM-DD HH:mm:ss');

// These setup tasks need to be performed before any test, so we
// do them in this file outside of any describe block.

before(() => {
  // `chaiAsPromised` must be used after other plugins to promisify them
  chai.use(chaiAsPromised);
});

after(async () => {
  const database = getTestDatabase();
  await clearTestData(database, testStartTime);
});
