/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import groupBy from 'lodash.groupby';

import { Aggregator, expandFetchOptionsToSpanAggregations } from '@tupaia/aggregator';
import { comparePeriods } from '@tupaia/utils';
import { Aggregation, Analytic, FetchOptions } from './types';

interface Data {
  analyticsByElement: Record<string, Analytic[]>;
  fetchOptions: FetchOptions;
  expandedFetchOptions: FetchOptions;
}

/**
 * This class encapsulates analytics fetching and retrieval of fetched data. The motivation
 * behind it is to optimise data fetches by minimising their number.
 *
 * An example:
 * * Indicator A wants to fetch FINAL_EACH_YEAR data for element BCD
 * * Indicator B wants to fetch FINAL_EACH_YEAR for element BCD and a year offset of -1
 * ("get me the results for the previous year")
 * * The original date range is 2018 - 2020
 *
 * We can combine both fetches in one, and fetch BCD for years 2017 - 2020, so that we can include
 * -1 offset data for the 2018 boundary.
 *
 * This means that the "scope" of the fetched data will be wider than the the original.
 * This class hides this scope transformation and allows each client (indicator) to retrieve
 * correct data based on the original scope (`fetchOptions`).
 */
export class AnalyticsRepository {
  private aggregator: Aggregator;

  private populatedData: Data | null = null;

  constructor(aggregator: Aggregator) {
    this.aggregator = aggregator;
  }

  private get data(): Data {
    if (!this.populatedData) {
      throw new Error('Please run fetchAnalytics first!');
    }
    return this.populatedData;
  }

  private set data(data: Data) {
    this.populatedData = data;
  }

  isPopulated() {
    return !!this.populatedData;
  }

  /**
   * @param allAggregations A combined list of aggregations across all data elements
   */
  async populate(
    dataElements: string[],
    allAggregations: Aggregation[],
    fetchOptions: FetchOptions,
  ) {
    const expandedFetchOptions = expandFetchOptionsToSpanAggregations(
      fetchOptions,
      allAggregations,
    );
    const { results: analytics } = await this.aggregator.fetchAnalytics(
      dataElements,
      expandedFetchOptions,
    );

    this.data = {
      analyticsByElement: groupBy(analytics, 'dataElement'),
      fetchOptions,
      expandedFetchOptions,
    };
  }

  getAnalyticsForDataElement = (dataElement: string) => this.data.analyticsByElement[dataElement];

  // TODO comment - difference between root and nested indicators
  aggregateRootAnalytics = (analytics: Analytic[], aggregations: Aggregation[]) => {
    const adjustedAnalytics = this.keepAnalyticsThatMatchFetchOptions(
      analytics,
      this.data.fetchOptions,
    );
    return this.aggregateAnalytics(adjustedAnalytics, aggregations, this.data.fetchOptions);
  };

  aggregateNestedAnalytics = (analytics: Analytic[], aggregations: Aggregation[]) =>
    this.aggregateAnalytics(analytics, aggregations, this.data.expandedFetchOptions);

  private aggregateAnalytics = (
    analytics: Analytic[],
    aggregations: Aggregation[],
    fetchOptions: FetchOptions,
  ) => this.aggregator.aggregateAnalytics(analytics, aggregations, fetchOptions.period);

  // TODO name
  private keepAnalyticsThatMatchFetchOptions = (
    analytics: Analytic[],
    fetchOptions: FetchOptions,
  ) => {
    const { startDate, endDate } = fetchOptions;
    return analytics.filter(
      ({ period }) =>
        comparePeriods(period, startDate) >= 0 && comparePeriods(period, endDate) <= 0,
    );
  };
}
