/**
 * Tupaia Config Server
 * Copyright (c) 2020 Beyond Essential Systems Pty Ltd
 */

import { DataBuilder } from '/apiV1/dataBuilders/DataBuilder';
import { applyFunction } from './functions';

class FunctionalPipelineMeasureBuilder extends DataBuilder {
  async build() {
    return this.runPipeLine();
  }

  async runPipeLine() {
    const { organisationUnitGroupCode } = this.query;
    const { query: pipelineQuery } = this.config.pipeline;

    let results;
    if (pipelineQuery.endpoint === 'analytics') {
      const analytics = await this.fetchAnalytics(pipelineQuery.dataElementCodes, {
        organisationUnitCode: organisationUnitGroupCode,
      });
      results = analytics.results;
    } else {
      // TODO: Fetch events
      results = [];
    }

    return this.processPipeline(results);
  }

  processPipeline(results) {
    const functions = this.config.pipeline.functions;
    const { dataElementCode } = this.query;

    return functions
      .reduce(
        (proccessedResults, fn) => {
          return applyFunction(fn, proccessedResults);
        },
        [...results],
      )
      .map(processedResult => ({
        organisationUnitCode: processedResult.organisationUnit,
        [dataElementCode]:
          processedResult.value === undefined ? '' : processedResult.value.toString(),
      }));
  }
}

export const functionalPipeline = async (aggregator, dhisApi, query, measureBuilderConfig = {}) => {
  const builder = new FunctionalPipelineMeasureBuilder(
    aggregator,
    dhisApi,
    measureBuilderConfig,
    query,
  );
  const responseObject = await builder.build();

  return responseObject;
};
