/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import keyBy from 'lodash.keyby';

import { Aggregator } from '@tupaia/aggregator';
import { DataBroker } from '@tupaia/data-broker';
import { getSortByKey } from '@tupaia/utils';
import { AnalyticsRepository } from './AnalyticsRepository';
import { Builder, createBuilder } from './Builder';
import { Analytic, FetchOptions, IndicatorApiInterface, ModelRegistry } from './types';

const MAX_INDICATOR_NESTING_DEPTH = 10;

export class IndicatorApi implements IndicatorApiInterface {
  private models: ModelRegistry;

  private aggregator: Aggregator;

  constructor(models: ModelRegistry, dataBroker: DataBroker) {
    this.models = models;
    this.aggregator = new Aggregator(dataBroker);
  }

  async buildAnalytics(indicatorCodes: string[], fetchOptions: FetchOptions): Promise<Analytic[]> {
    const {
      buildersByNestDepth,
      codesToFetch,
      aggregations,
    } = await this.getFetchAnalyticsDependencies(indicatorCodes);

    const analyticsRepo = new AnalyticsRepository(this.aggregator);
    await analyticsRepo.populate(codesToFetch, aggregations, fetchOptions);
    const [rootBuilders = []] = buildersByNestDepth;
    const buildersByIndicator = keyBy(buildersByNestDepth.flat(), b => b.getIndicator().code);

    return rootBuilders
      .map(b => b.buildAnalytics(analyticsRepo, buildersByIndicator, fetchOptions))
      .flat()
      .sort(getSortByKey('period'));
  }

  /**
   * An indicator may contain references to
   * a. Other nested indicators
   * b. "Primitive" elements (eg `dhis`, `tupaia` elements)
   *
   * Here we use the first category to compile a list of codes belonging to the second category,
   * one nesting level at a time. We also include all nested indicators and all aggregations that
   * will be used. This information is useful to other clients that fetch and build analytics
   */
  private getFetchAnalyticsDependencies = async (rootIndicatorCodes: string[]) => {
    const buildersByNestDepth: Builder[][] = [];
    const codesToFetch = [];
    const aggregations = [];

    let i;
    let currentIndicatorCodes = rootIndicatorCodes;
    for (i = 0; i < MAX_INDICATOR_NESTING_DEPTH; i++) {
      const isRoot = i === 0;
      const currentBuilders = await this.indicatorCodesToBuilders(currentIndicatorCodes, isRoot);
      buildersByNestDepth.push(currentBuilders);
      if (currentBuilders.length === 0) {
        // No more indicators (root or nested)
        break;
      }

      const codesByFetchCategory = await this.getElementCodesByFetchCategory(currentBuilders);
      currentIndicatorCodes = codesByFetchCategory.indicator;
      codesToFetch.push(...codesByFetchCategory.nonIndicator);
      const currentAggregations = currentBuilders.map(b => b.getAggregations()).flat();
      aggregations.push(...currentAggregations);
    }

    if (i === MAX_INDICATOR_NESTING_DEPTH) {
      // Avoid getting stuck in self-referencing indicators and cyclical references
      throw new Error(`Max indicator nesting depth reached: ${MAX_INDICATOR_NESTING_DEPTH}`);
    }

    return { buildersByNestDepth, codesToFetch, aggregations };
  };

  private indicatorCodesToBuilders = async (codes: string[], isRoot: boolean) => {
    const indicators = await this.models.indicator.find({ code: codes });
    return indicators.map(i => createBuilder(i, isRoot));
  };

  private getElementCodesByFetchCategory = async (builders: Builder[]) => {
    const codesByFetchCategory: { indicator: string[]; nonIndicator: string[] } = {
      indicator: [],
      nonIndicator: [],
    };

    const dataElements = await this.models.dataSource.find({
      code: builders.map(b => b.getElementCodesToFetch()).flat(),
      type: 'dataElement',
    });
    dataElements.forEach(({ service_type: serviceType, code }) => {
      const category = serviceType === 'indicator' ? 'indicator' : 'nonIndicator';
      codesByFetchCategory[category].push(code);
    });

    return codesByFetchCategory;
  };
}
