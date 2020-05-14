/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { getTestDatabase, ModelRegistry } from '@tupaia/database';
import { ApiStubRegistry, DhisApiStub } from '../../../utilities';

// TODO use correct type in data elements!

const stubFetch = () => {
  const apiStubRegistry = new ApiStubRegistry();
  // TODO add resourceData
  const dhisApiStub = new DhisApiStub();
  return apiStubRegistry.add(dhisApiStub).getSinonFetchStub();
};

export const setup = async () => {
  const models = new ModelRegistry(getTestDatabase());

  // TODO stub fetch
};
