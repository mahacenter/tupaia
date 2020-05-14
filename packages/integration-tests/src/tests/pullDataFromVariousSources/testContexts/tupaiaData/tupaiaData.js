/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { buildAndInsertSurveys, getTestDatabase, ModelRegistry } from '@tupaia/database';
import fixtures from './fixtures.json';

export const setup = async () => {
  const models = new ModelRegistry(getTestDatabase());
  const { survey } = fixtures;

  await buildAndInsertSurveys(models, [survey]);
};
