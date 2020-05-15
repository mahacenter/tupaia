/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { expect } from 'chai';

const getTestCaseRunner = ({ only, skip }) => {
  if (skip) {
    return it.skip;
  }
  if (only) {
    return it.only;
  }
  return it;
};

export const runTestsUsingObjectMethod = (tests, object, methodName) => {
  tests.forEach(
    ({ only = false, skip = false, httpRequestMocks = [], description, input, output }) => {
      const runTestCase = getTestCaseRunner({ only, skip });

      runTestCase(description, async () => {
        httpRequestMocks.forEach(({ endpoint, queryParams, response }) => {
          console.log('mocking');
          // fetchMock.mock(/api/, response);
        });

        // fetchMock.mock('*', 200);
        try {
          const response = await object[methodName].bind(object)(...input);
          expect(response).to.deep.equal(output);
        } finally {
          // TODO
        }
      });
    },
  );
};
