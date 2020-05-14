/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import * as NodeFetch from 'node-fetch';
import sinon from 'sinon';

import { ApiStubRegistry, DhisApiStub } from '../../../utilities';

export const setup = async () => {
  const apiStubRegistry = new ApiStubRegistry();
  // TODO add resourceData
  const dhisApiStub = new DhisApiStub();
  apiStubRegistry.add(dhisApiStub);
  console.log(NodeFetch);
  console.log({ result1: NodeFetch.Promise });
  // console.log(NodeFetch.default.Fetch);
  // console.log(NodeFetch.Fetch);
  sinon.stub(NodeFetch, 'Request').callsFake(async x => {
    console.log('called stubed!');
    return apiStubRegistry.fetch(x);
  }); // TODO bind
};

export const tearDown = async () => {
  NodeFetch.Promise.restore();
};
