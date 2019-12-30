/**
 * Tupaia Config Server
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd
 */

/* eslint-disable class-methods-use-this */

import keyBy from 'lodash.keyby';

import { Entity } from '/models/Entity';
import { DataBuilder } from '/apiV1/dataBuilders/DataBuilder';
import { formatFacilityDataForOverlay } from '/apiV1/utils';

/**
 * @abstract
 */
export class DataPerOrgUnitBuilder extends DataBuilder {
  constructor(...constructorArgs) {
    super(...constructorArgs);
    this.constructorArgs = [...constructorArgs];
    this.baseBuilder = null;
  }

  /**
   * @abstract
   * @returns {DataBuilder}
   */
  getBaseBuilderClass() {
    throw new Error(
      'Any subclass of DataPerOrgUnitBuilder must implement the "getBaseBuilderClass" method',
    );
  }

  getBaseBuilder() {
    if (this.baseBuilder !== null) {
      return this.baseBuilder;
    }

    const BaseBuilder = this.getBaseBuilderClass();
    const builder = new BaseBuilder(...this.constructorArgs);

    if (!(builder instanceof DataBuilder)) {
      throw new Error('Invalid builder provided, must be a subclass of DataBuilder');
    }
    if (typeof builder.buildData !== 'function') {
      throw new Error(
        'The base builder for a period builder must implement the "buildData" method',
      );
    }

    this.baseBuilder = builder;
    return builder;
  }

  /**
   * @abstract
   * @returns {Promise<Array>}
   */
  async fetchResults() {
    throw new Error(
      'Any subclass of DataPerOrgUnitBuilder must implement the "fetchResults" method',
    );
  }

  /**
   * @abstract
   * @param {Array} results
   * @returns {Object<string, Array>}
   */
  groupResultsByOrgUnitCode(results) {
    throw new Error(
      'Any subclass of DataPerOrgUnitBuilder must implement the "groupResultsByOrgUnitCode" method',
    );
  }

  async fetchOrgUnitData() {
    const { organisationUnitGroupCode } = this.query;
    const orgUnits = await Entity.getFacilityDescendantsWithCoordinates(organisationUnitGroupCode);

    return keyBy(orgUnits, 'code');
  }

  async buildData(results) {
    const { dataElementCode } = this.query;
    const resultsByOrgUnit = this.groupResultsByOrgUnitCode(results);
    const baseBuilder = this.getBaseBuilder();
    const orgUnitData = await this.fetchOrgUnitData();

    const processResultsForOrgUnit = async orgUnitCode => {
      const resultsForOrgUnit = resultsByOrgUnit[orgUnitCode];
      if (!resultsForOrgUnit) {
        return;
      }

      const data = await baseBuilder.buildData(resultsForOrgUnit);
      if (data.length !== 1) {
        throw new Error('The base data builder should return a single element array');
      }
      orgUnitData[orgUnitCode][dataElementCode] = data[0][dataElementCode];
    };
    await Promise.all(Object.keys(orgUnitData).map(processResultsForOrgUnit));

    return Object.values(orgUnitData);
  }

  /**
   * Override in subclasses to provide custom data formatting
   *
   * @param {Array} data
   */
  formatData(data) {
    return data;
  }

  /**
   * @public
   */
  async build() {
    const results = await this.fetchResults();
    const data = await this.buildData(results);

    return this.formatData(data).map(formatFacilityDataForOverlay);
  }
}
