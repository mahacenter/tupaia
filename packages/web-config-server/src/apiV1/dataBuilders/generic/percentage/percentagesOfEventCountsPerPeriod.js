/**
 * Tupaia Config Server
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd
 */

import { DataPerPeriodBuilder } from 'apiV1/dataBuilders/DataPerPeriodBuilder';
import { PercentagesOfEventCountsBuilder } from '/apiV1/dataBuilders/generic/percentage/percentagesOfEventCounts';
import { groupEventsByPeriod } from '/dhis';

/**
 * Configuration schema
 * @typedef {Object} PercentagesOfEventCountsPerPeriodConfig
 * @property {string} programCode
 * @property {string} periodType
 * @property {Object<string, EventPercentage>} dataClasses
 *
 * Example
 * ```js
 * {
 *   programCode: 'SCRF',
 *   periodType: 'month',
 *   dataClasses: {
 *     Male: {
 *       numerator: { dataValues: { STR_CRF15: 'Male' } },
 *       denominator: { dataValues: { STR_CRF125: '1' } },
 *     },
 *   }
 * }
 * ```
 */

class PercentagesOfEventCountsPerPeriodBuilder extends DataPerPeriodBuilder {
  getBaseBuilderClass = () => PercentagesOfEventCountsBuilder;

  groupResultsByPeriod = groupEventsByPeriod;

  fetchResults() {
    return this.getEvents({ dataElementIdScheme: 'code', dataValueFormat: 'object' });
  }

  formatData(data) {
    return this.areDataAvailable(data) ? data : [];
  }
}

export const percentagesOfEventCountsPerPeriod = async (
  { dataBuilderConfig, query, entity },
  dhisApi,
) => {
  const builder = new PercentagesOfEventCountsPerPeriodBuilder(
    dhisApi,
    dataBuilderConfig,
    query,
    entity,
  );

  return builder.build();
};
