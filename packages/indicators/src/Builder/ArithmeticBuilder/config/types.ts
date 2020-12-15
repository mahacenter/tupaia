/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { Aggregation, Indicator } from '../../../types';

/**
 * A single aggregation
 */
export type AggregationDescriptor = string | Aggregation;

/**
 * A list of aggregation(s) that will be applied to a data element
 */
export type AggregationSpecs = AggregationDescriptor | AggregationDescriptor[];

/**
 * A flexible config schema that can be provided as an input to the indicator
 */
export type ArithmeticConfig = {
  readonly formula: string;
  // If `AggregationSpecs` (and not a Record) is passed, it will be applied to all elements in `formula`
  readonly aggregation: AggregationSpecs | Record<string, AggregationSpecs>;
  readonly parameters?: Indicator[];
  readonly defaultValues?: Record<string, number>;
};
