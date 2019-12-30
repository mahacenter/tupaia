import { expect } from 'chai';
import sinon from 'sinon';

import { composePercentagesPerPeriod } from '/apiV1/dataBuilders';
import * as ComposeDataPerPeriod from '/apiV1/dataBuilders/generic/compose/composeDataPerPeriod';

const stubComposeDataPerPeriod = expectedData =>
  sinon.stub(ComposeDataPerPeriod, 'composeDataPerPeriod').returns(expectedData);

const restoreComposeDataPerPeriod = () => {
  ComposeDataPerPeriod.composeDataPerPeriod.restore();
};

describe('composePercentagesPerPeriod', () => {
  afterEach(() => {
    restoreComposeDataPerPeriod();
  });

  it('should call composeDataPerPeriod() with the correct arguments', async () => {
    const composeDataPerPeriodStub = stubComposeDataPerPeriod({ data: [] });
    const config = { dataBuilderConfig: { percentages: {} } };
    const dhisApiStub = {};

    await composePercentagesPerPeriod(config, dhisApiStub);
    expect(composeDataPerPeriodStub).to.have.been.calledOnceWith(config, dhisApiStub);
  });

  it('should compose period data for a single percentage definition', async () => {
    const config = {
      dataBuilderConfig: {
        percentages: {
          result: { numerator: 'positive', denominator: 'total' },
        },
      },
    };
    const data = [
      { timestamp: 1569888000000, name: 'Oct 2019', positive: 1, total: 2 },
      { timestamp: 1572566400000, name: 'Nov 2019', positive: 3, total: 4 },
    ];
    stubComposeDataPerPeriod({ data });

    return expect(composePercentagesPerPeriod(config)).to.eventually.have.deep.property('data', [
      { timestamp: 1569888000000, name: 'Oct 2019', result: 0.5 },
      { timestamp: 1572566400000, name: 'Nov 2019', result: 0.75 },
    ]);
  });

  it('should compose period data for multiple percentage definitions', async () => {
    const config = {
      dataBuilderConfig: {
        percentages: {
          positivePercentage: { numerator: 'positive', denominator: 'total' },
          femalePercentage: { numerator: 'female', denominator: 'population' },
        },
      },
    };
    const data = [
      {
        timestamp: 1569888000000,
        name: 'Oct 2019',
        positive: 1,
        total: 2,
        female: 150,
        population: 600,
      },
      {
        timestamp: 1572566400000,
        name: 'Nov 2019',
        positive: 3,
        total: 4,
        female: 300,
        population: 600,
      },
    ];
    stubComposeDataPerPeriod({ data });

    return expect(composePercentagesPerPeriod(config)).to.eventually.have.deep.property('data', [
      {
        timestamp: 1569888000000,
        name: 'Oct 2019',
        positivePercentage: 0.5,
        femalePercentage: 0.25,
      },
      {
        timestamp: 1572566400000,
        name: 'Nov 2019',
        positivePercentage: 0.75,
        femalePercentage: 0.5,
      },
    ]);
  });

  it('should exclude non numeric percentages from the results', async () => {
    const config = {
      dataBuilderConfig: {
        percentages: {
          result: { numerator: 'positive', denominator: 'total' },
        },
      },
    };
    const data = [
      { timestamp: 1569888000000, name: 'Oct 2019', total: 2 },
      { timestamp: 1572566400000, name: 'Nov 2019', positive: 3, total: 4 },
    ];
    stubComposeDataPerPeriod({ data });

    return expect(composePercentagesPerPeriod(config)).to.eventually.have.deep.property('data', [
      { timestamp: 1572566400000, name: 'Nov 2019', result: 0.75 },
    ]);
  });
});
