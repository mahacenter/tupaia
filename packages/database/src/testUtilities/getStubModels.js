/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import sinon from 'sinon';

// currently just tests against arrays or plain values; in future could be extended to support
// objects of the same format as TupaiaDatabase, e.g. { comparator: 'like', comparisonValue: '%a' }
function testValueMatchesCondition(matchCondition, value) {
  if (Array.isArray(matchCondition)) {
    return matchCondition.includes(value);
  }
  return matchCondition === value;
}

function testRecordMeetsCriteria(criteria, record) {
  return Object.entries(criteria).every(([field, matchCondition]) =>
    testValueMatchesCondition(matchCondition, record[field]),
  );
}

function generateStubModel(dummyRecords) {
  const filterDummyRecords = criteria =>
    dummyRecords.filter(r => testRecordMeetsCriteria(criteria, r));

  return {
    all: sinon.stub().callsFake(async () => dummyRecords),
    find: sinon.stub().callsFake(async criteria => filterDummyRecords(criteria)),
    findOne: sinon.stub().callsFake(async criteria => {
      const filteredRecords = filterDummyRecords(criteria);
      return filteredRecords.length ? filteredRecords[0] : null;
    }),
    createMany: sinon.stub().callsFake(async () => {}),
  };
}

/**
 * Will generate an object containing a partially functional database model stub based for each
 * entry in dummyData
 * @param {Object} dummyData e.g.
 *  {
 *    project: [
 *      { id: 'xxx', code: 'XXX', name: 'Fake Project 1' },
 *      { id: 'yyy', code: 'YYY', name: 'Fake Project 2' },
 *    ],
 *    entity: [
 *      {id: 'aaa', code: 'AAA', name: 'Fake Entity 1' },
 *      {id: 'bbb', code: 'BBB', name: 'Fake Entity 2' },
 *    ],
 *  }
 */
export function getStubModels(dummyData) {
  return Object.entries(dummyData).reduce(
    (models, [modelName, dummyRecords]) => ({
      ...models,
      [modelName]: generateStubModel(dummyRecords),
    }),
    {},
  );
}
