/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { ObjectValidator } from '@tupaia/utils';
import { AnalyticsRepository } from '../AnalyticsRepository';
import { Aggregation, Analytic, AnalyticValue, FetchOptions, Indicator } from '../types';

export abstract class Builder {
  protected readonly indicator: Indicator;

  protected readonly isRoot: boolean;

  constructor(indicator: Indicator, isRoot = false) {
    this.indicator = indicator;
    this.isRoot = isRoot;
  }

  getIndicator() {
    return this.indicator;
  }

  abstract getElementCodesToFetch(): string[];

  abstract getAggregations(): Aggregation[];

  buildAnalytics = (
    populatedAnalyticsRepo: AnalyticsRepository,
    buildersByIndicator: Record<string, Builder>,
    fetchOptions: FetchOptions,
  ): Analytic[] => {
    if (!populatedAnalyticsRepo.isPopulated()) {
      throw new Error(
        'buildAnalytics expects that the provided analyticsRepository is already populated',
      );
    }

    return this.buildAnalyticValues(
      populatedAnalyticsRepo,
      buildersByIndicator,
      fetchOptions,
    ).map(value => ({ ...value, dataElement: this.indicator.code }));
  };

  abstract buildAnalyticValues(
    populatedAnalyticsRepo: AnalyticsRepository,
    buildersByIndicator: Record<string, Builder>,
    fetchOptions: FetchOptions,
  ): AnalyticValue[];

  protected validateConfig = <T extends Record<string, unknown>>(validators = {}): T => {
    new ObjectValidator(validators).validateSync(
      this.indicator.config,
      (error: string, field: string) => new Error(`Error in field '${field}': ${error}`),
    );
    // Ideally we wouldn't return a value; we would define the return type as `asserts config is T`
    // Since async assertions are not supported yet, we return the asserted type as a workaround:
    // https://github.com/microsoft/TypeScript/issues/37515
    return this.indicator.config as T;
  };
}
