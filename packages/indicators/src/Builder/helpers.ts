/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import groupBy from 'lodash.groupby';

import { Aggregator } from '@tupaia/aggregator';
import { Aggregation, Analytic, FetchOptions } from '../types';

export const groupKeysByValueJson = (object: Record<string, unknown>) =>
  groupBy(Object.keys(object), code => JSON.stringify(object[code]));

export const fetchAnalytics = async (
  aggregator: Aggregator,
  aggregationsByCode: Record<string, Aggregation[]>,
  fetchOptions: FetchOptions,
): Promise<Analytic[]> => {
  // A different collection of aggregations may be required for each data element code,
  // but only one collection can be provided in an aggregator call
  // Group data elements per aggregation collection to minimise aggregator calls
  const aggregationJsonToCodes = groupKeysByValueJson(aggregationsByCode);

  const analytics: Analytic[] = [];
  await Promise.all(
    Object.entries(aggregationJsonToCodes).map(async ([aggregationJson, codes]) => {
      const aggregations = JSON.parse(aggregationJson);
      const { results } = await aggregator.fetchAnalytics(codes, fetchOptions, { aggregations });
      analytics.push(...results);
    }),
  );

  return analytics;
};
