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
  tests.forEach(({ only = false, skip = false, description, input, output }) => {
    const runTestCase = getTestCaseRunner({ only, skip });

    runTestCase(description, () =>
      // TODO eventually works for non async?
      expect(object[methodName].bind(object)(...input)).to.eventually.deep.equal(output),
    );
  });
};
