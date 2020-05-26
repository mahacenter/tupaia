import { DataBuilder } from '/apiV1/dataBuilders/DataBuilder';
import { checkValueSatisfiesCondition } from '/apiV1/dataBuilders/helpers';
import { analyticsToMeasureData } from 'apiV1/measureBuilders/helpers';

class CheckConditionsBuilder extends DataBuilder {
  async build() {
    const { dataElementCode: queryDataCode } = this.query;
    const { condition, dataElementCodes: configDataCodes } = this.config;

    const dataElementCodes = configDataCodes || [queryDataCode];
    console.log(dataElementCodes, configDataCodes, queryDataCode);
    const { results } = await this.fetchAnalytics(dataElementCodes);
    const analytics = results.map(result => ({
      ...result,
      value: checkValueSatisfiesCondition(result.value, condition) ? 1 : 0,
    }));
    return queryDataCode === 'value'
      ? analyticsToMeasureData(analytics, 'value')
      : analyticsToMeasureData(analytics);
  }
}

export const checkConditions = async (aggregator, dhisApi, query, measureBuilderConfig = {}) => {
  const builder = new CheckConditionsBuilder(
    aggregator,
    dhisApi,
    measureBuilderConfig,
    query,
    undefined,
    measureBuilderConfig.aggregationType,
  );

  return builder.build();
};
