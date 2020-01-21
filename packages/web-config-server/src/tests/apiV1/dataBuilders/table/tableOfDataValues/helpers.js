/**
 * Tupaia Config Server
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd
 */

import { expect } from 'chai';
import sinon from 'sinon';

import { tableOfDataValues } from '/apiV1/dataBuilders';
import { DhisApi } from '/dhis/DhisApi';

const query = { organisationUnitCode: 'TO' };

const createDhisApiStub = dataValues => {
  const getAnalytics = sinon.stub();
  getAnalytics
    .returns({ results: [] })
    .withArgs(sinon.match({ outputIdScheme: 'code' }), query)
    .callsFake(({ dataElementCodes }) => ({
      results: Object.values(dataValues).filter(({ dataElement }) =>
        dataElementCodes.includes(dataElement),
      ),
    }));

  const fetch = sinon.stub();
  fetch.callsFake((endpoint, { filter }) => {
    const metadatas = [];
    const codes = convertCodesFilterStringToArrayOfCodes(filter);
    codes.forEach(code => {
      const dataValue = dataValues.find(val => val.dataElement === code);
      if (dataValue && dataValue.metadata) {
        metadatas.push(dataValue.metadata);
      }
    });
    return { dataElements: metadatas };
  });

  return sinon.createStubInstance(DhisApi, { getAnalytics, fetch });
};

export const createAssertTableResults = availableDataValues => {
  const dhisApiStub = createDhisApiStub(availableDataValues);

  return async (dataBuilderConfig, expectedResults) =>
    expect(tableOfDataValues({ dataBuilderConfig, query }, dhisApiStub)).to.eventually.deep.equal(
      expectedResults,
    );
};

export const createAssertErrorIsThrown = availableDataValues => {
  const dhisApiStub = createDhisApiStub(availableDataValues);

  return async (dataBuilderConfig, expectedError) =>
    expect(
      tableOfDataValues({ dataBuilderConfig, query }, dhisApiStub),
    ).to.eventually.be.rejectedWith(expectedError);
};

// Remove the opening 'code:in:[' and trailing ']' and split on commas
const convertCodesFilterStringToArrayOfCodes = codesFilterString =>
  codesFilterString
    .substr(9)
    .slice(0, -1)
    .split(',');
