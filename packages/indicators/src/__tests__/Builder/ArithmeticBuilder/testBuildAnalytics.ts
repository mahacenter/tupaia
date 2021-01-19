/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { ArithmeticBuilder } from '../../../Builder/ArithmeticBuilder/ArithmeticBuilder';
import { DbRecord, FetchOptions } from '../../../types';
import { createPopulatedAnalyticsRepository } from '../stubs';
import { AGGREGATOR_ANALYTICS } from './ArithmeticBuilder.fixtures';

export const testBuildAnalytics = () => {
  const populatedAnalyticsRepo = createPopulatedAnalyticsRepository(AGGREGATOR_ANALYTICS);

  const valuesToAnalytics = (values: number[]) =>
    values.map(value => ({
      dataElement: 'TestAnalytics',
      organisationUnit: 'TO',
      period: '2019',
      value,
    }));

  describe('arithmetic', () => {
    const testData: [string, string, number[]][] = [
      ['simple expression - integer result', 'One + Two', [3]],
      ['simple expression - float result', 'One / Two', [1 / 2]],
      ['complex expression', '((One + Two) * Three) / (Four - Five)', [((1 + 2) * 3) / (4 - 5)]],
      ['division with zero', 'One / (One + Two - Three)', []],
      ['some data elements are undefined in the orgUnit/period combo', 'One + Undefined', []],
    ];

    it.each(testData)('%s', async (_, formula, expectedValues) => {
      const config = { formula, aggregation: 'RAW' };
      const indicator = { code: 'TestAnalytics', builder: 'arithmetic', config };
      const builder = new ArithmeticBuilder(indicator);
      const expected = valuesToAnalytics(expectedValues);

      expect(
        builder.buildAnalytics(populatedAnalyticsRepo, {}, {} as FetchOptions),
      ).toIncludeSameMembers(expected);
    });
  });

  describe('boolean', () => {
    const testData: [string, string, number[]][] = [
      ['> (true)', 'Two > One', [1]],
      ['> (false)', 'One > Two', [0]],
      ['= (true)', 'Zero == Zero', [1]],
      ['= (false)', 'Zero == One', [0]],
      ['< (true)', 'Two < Five', [1]],
      ['< (false)', 'Five < Two', [0]],
      ['and (true)', '(Two > One) and (Two < Three)', [1]],
      ['and (false)', '(Two > One) and (Two > Three)', [0]],
      ['or (true)', '(Two == One) or (Two < Three)', [1]],
      ['or (false)', '(Two == One) or (Two > Three)', [0]],
      [
        'complex expression - comparisons',
        '((Two + One) / (Five)) > ((One + One) / (Three))',
        // eslint-disable-next-line no-constant-condition
        [(2 + 1) / 5 > (1 + 1) / 3 ? 1 : 0],
      ],
      [
        'complex expression - boolean operators',
        '(Three < Two) or ((Two > One) and not (Two > Five))',
        // eslint-disable-next-line no-constant-condition
        [3 < 2 || (2 > 1 && !(2 > 5)) ? 1 : 0],
      ],
      [
        'complex expression - boolean operators',
        '(Three < 4 / 2) or ((Two > 1) and not (Two > (2 + 3)))',
        // eslint-disable-next-line no-constant-condition, yoda
        [3 < 4 / 2 || (2 > 1 && !(2 > 2 + 3)) ? 1 : 0],
      ],
    ];

    it.each(testData)('%s', (_, formula, expectedValues) => {
      const config = { formula, aggregation: 'RAW' };
      const indicator = { code: 'TestAnalytics', builder: 'arithmetic', config };
      const builder = new ArithmeticBuilder(indicator);
      const expected = valuesToAnalytics(expectedValues);

      expect(
        builder.buildAnalytics(populatedAnalyticsRepo, {}, {} as FetchOptions),
      ).toIncludeSameMembers(expected);
    });
  });

  describe('multiple orgUnit/period combos', () => {
    const testData: [string, DbRecord, [string, string, number][]][] = [
      [
        'all data elements are defined in all combos',
        {
          formula: 'A_ToPg_20192020 + B_ToPg_20192020',
          aggregation: 'FINAL_EACH_YEAR',
        },
        [
          ['TO', '2019', 3],
          ['TO', '2020', 30],
          ['PG', '2019', 3.3000000000000003],
          ['PG', '2020', 33],
        ],
      ],
      [
        'some data elements are undefined in some periods',
        {
          formula: 'A_ToPg_20192020 + C_ToPg_2019',
          aggregation: 'FINAL_EACH_YEAR',
        },
        [
          ['TO', '2019', 4],
          ['PG', '2019', 4.4],
        ],
      ],
      [
        'some data elements are undefined in some org units',
        {
          formula: 'A_ToPg_20192020 + D_To_20192020',
          aggregation: 'FINAL_EACH_YEAR',
        },
        [
          ['TO', '2019', 5],
          ['TO', '2020', 50],
        ],
      ],
      [
        'all combos include an undefined data element',
        {
          formula: 'C_ToPg_2019 + D_To_20192020 + E_Pg_20192020',
          aggregation: 'FINAL_EACH_YEAR',
        },
        [],
      ],
      [
        'some combos include an undefined data element, but all defaults defined',
        {
          formula: 'C_ToPg_2019 + E_Pg_20192020',
          aggregation: 'FINAL_EACH_YEAR',
          defaultValues: {
            C_ToPg_2019: 10,
            E_Pg_20192020: 100,
          },
        },
        [
          ['TO', '2019', 103],
          ['PG', '2019', 8.8],
          ['PG', '2020', 65],
        ],
      ],
      [
        'some combos include an undefined data element, but not all defaults defined',
        {
          formula: 'C_ToPg_2019 + E_Pg_20192020',
          aggregation: 'FINAL_EACH_YEAR',
          defaultValues: {
            C_ToPg_2019: 10,
          },
        },
        [
          ['PG', '2019', 8.8],
          ['PG', '2020', 65],
        ],
      ],
      [
        "defaults don't replace 0s",
        {
          formula: 'Zero * 2',
          aggregation: 'FINAL_EACH_YEAR',
          defaultValues: {
            Zero: 10,
          },
        },
        [['TO', '2019', 0]],
      ],
    ];

    it.each(testData)('%s', (_, config, expectedDimensions) => {
      const indicator = { code: 'TestAnalytics', builder: 'arithmetic', config };
      const builder = new ArithmeticBuilder(indicator);
      const expected = expectedDimensions.map(([organisationUnit, period, value]) => ({
        dataElement: 'TestAnalytics',
        organisationUnit,
        period,
        value,
      }));

      expect(
        builder.buildAnalytics(populatedAnalyticsRepo, {}, {} as FetchOptions),
      ).toIncludeSameMembers(expected);
    });
  });
};