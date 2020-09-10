/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { expect } from 'chai';
import { getStubModels } from '../testUtilities';

// This holds tests for the utilities used in other tests
const dummyProjectX = { id: 'xxx', code: 'XXX', name: 'Dummy Project X' };
const dummyProjectY = { id: 'yyy', code: 'YYY', name: 'Dummy Project Y' };
const dummyProjectZ = { id: 'zzz', code: 'ZZZ', name: 'Dummy Project Z' };
const dummyEntityA = { id: 'aaa', code: 'AAA', name: 'Dummy Entity A', type: 'clinic', group: 1 };
const dummyEntityB = { id: 'bbb', code: 'BBB', name: 'Dummy Entity B', type: 'school', group: 1 };
const dummyEntityC = { id: 'ccc', code: 'CCC', name: 'Dummy Entity C', type: 'clinic', group: 2 };
const dummyEntityD = { id: 'ddd', code: 'DDD', name: 'Dummy Entity D', type: 'clinic', group: 2 };
const dummyData = {
  project: [dummyProjectX, dummyProjectY, dummyProjectZ],
  entity: [dummyEntityA, dummyEntityB, dummyEntityC, dummyEntityD],
};
describe.only('getStubModels()', () => {
  const models = getStubModels(dummyData);

  it('creates a stub model for each field in the dummy data', () => {
    expect(models).to.have.all.keys('project', 'entity');
  });

  describe('stubbedModel.all()', () => {
    it('finds all records', async () => {
      const results = await models.project.all();
      expect(results).to.deep.equal([dummyProjectX, dummyProjectY, dummyProjectZ]);
    });
  });

  describe('stubbedModel.find()', () => {
    it('finds a single record on a single field', async () => {
      const results = await models.project.find({ id: 'yyy' });
      expect(results).to.deep.equal([dummyProjectY]);
    });

    it('finds multiple records on a single field', async () => {
      const results = await models.entity.find({ type: 'clinic' });
      expect(results).to.deep.equal([dummyEntityA, dummyEntityC, dummyEntityD]);
    });

    it('finds a single record on multiple fields', async () => {
      const results = await models.entity.find({ type: 'clinic', group: 1 });
      expect(results).to.deep.equal([dummyEntityA]);
    });

    it('finds multiple records on a multiple fields', async () => {
      const results = await models.entity.find({ type: 'clinic', group: 2 });
      expect(results).to.deep.equal([dummyEntityC, dummyEntityD]);
    });

    it('handles an array condition', async () => {
      const results = await models.entity.find({ code: ['BBB', 'CCC', 'DDD'] });
      expect(results).to.deep.equal([dummyEntityB, dummyEntityC, dummyEntityD]);
    });

    it('handles an array condition in combination with another condition', async () => {
      const results = await models.entity.find({ code: ['BBB', 'CCC', 'DDD'], group: 2 });
      expect(results).to.deep.equal([dummyEntityC, dummyEntityD]);
    });
  });

  describe('stubbedModel.findOne()', () => {
    it('finds a record on a single field', async () => {
      const record = await models.project.findOne({ id: 'yyy' });
      expect(record).to.equal(dummyProjectY);
    });

    it('returns the first record when multiple match on a single field', async () => {
      const record = await models.entity.findOne({ type: 'clinic' });
      expect(record).to.equal(dummyEntityA);
    });

    it('finds a record on multiple fields', async () => {
      const record = await models.entity.findOne({ type: 'clinic', group: 1 });
      expect(record).to.equal(dummyEntityA);
    });

    it('handles an array condition', async () => {
      const record = await models.entity.findOne({ code: ['BBB', 'CCC', 'DDD'], group: 1 });
      expect(record).to.equal(dummyEntityB);
    });
  });
});
