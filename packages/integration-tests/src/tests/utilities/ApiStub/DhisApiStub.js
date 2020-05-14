/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import keyBy from 'lodash.keyby';

import { ApiStub } from './ApiStub';

const HEADERS = {
  pestartdate: {
    name: 'pestartdate',
    column: 'Period start date',
    valueType: 'DATETIME',
    type: 'java.util.Date',
    hidden: false,
    meta: false,
  },
  peenddate: {
    name: 'peenddate',
    column: 'Period end date',
    valueType: 'DATETIME',
    type: 'java.util.Date',
    hidden: false,
    meta: false,
  },
  value: {
    name: 'value',
    column: 'Value',
    valueType: 'NUMBER',
    type: 'java.lang.Double',
    hidden: false,
    meta: false,
  },
  dx: {
    name: 'dx',
    column: 'Data',
    valueType: 'TEXT',
    type: 'java.lang.String',
    hidden: false,
    meta: true,
  },
  co: {
    name: 'co',
    column: 'Category option combo',
    valueType: 'TEXT',
    type: 'java.lang.String',
    hidden: false,
    meta: true,
  },
  ou: {
    name: 'ou',
    column: 'Organisation unit',
    valueType: 'TEXT',
    type: 'java.lang.String',
    hidden: false,
    meta: true,
  },
  pe: {
    name: 'pe',
    valueType: 'TEXT',
    type: 'java.lang.String',
    hidden: false,
    meta: true,
  },
};

const RESOURCES = {
  /**
   * Schema: { code }
   */
  DATA_ELEMENT: 'dataElement',
  /**
   * Schema: { orgUnitCode, dataElementCode, value, period }
   */
  DATA_VALUE: 'dataValue',
  /**
   * Schema: { code }
   */
  ORGANISATION_UNIT: 'organisationUnit',
};

// TODO add dataValue Example

export class DhisApiStub extends ApiStub {
  static API_URL = 'https://dev-aggregation.tupaia.org/api';

  data;

  constructor(data = {}) {
    super();

    this.data = this.parseData(data);
    this.dataMaps = this.buildDataMaps(data);
  }

  /**
   * Simulates a DHIS data repository. The structure used is not an accurate representation of an
   * actual DHIS database, but rather one which is convenient for the purposes of this class
   */
  parseData = data =>
    Object.values(RESOURCES).reduce(
      (parsedData, resourceKey) => ({ ...parsedData, [resourceKey]: data[resourceKey] || [] }),
      {},
    );

  /**
   * Builds data maps for optimised resource searching
   */
  buildDataMaps = data => {
    const {
      [RESOURCES.DATA_VALUE]: dataElements = [],
      [RESOURCES.ORGANISATION_UNIT]: orgUnits = [],
    } = data;

    return {
      orgUnitByCode: keyBy(orgUnits, 'code'),
      dataElementByCode: keyBy(dataElements, 'code'),
    };
  };

  // eslint-disable-next-line class-methods-use-this
  getApiUrl() {
    return DhisApiStub.API_URL;
  }

  // TODO break query params
  getHandlers() {
    return {
      'analytics/rawData.json': {
        get: this.getRawAnalytics, // TODO bind this?
      },
    };
  }

  /**
   * @returns {Object<string, string[]>}
   */
  // TODO name
  parseDimensionParam = dimensionParam => {
    // TODO parse actual dimension string in query...
    const { dimension: dimensionStrings = [] } = dimensionParam.split('&');

    const dimensions = {};
    dimensionStrings.forEach(dimensionString => {
      const [key, valuesString = ''] = dimensionString.split(':');
      if (key) {
        dimensions[key] = valuesString ? valuesString.split(';') : [];
      }
    });

    return dimensions;
  };

  getRawAnalytics(query) {
    // TODO only with `get` method

    const { requestedDimensions } = this.parseDimensionParam(query);

    return {
      headers: this.buildRawAnalyticsHeaders(requestedDimensions),
      rows: this.buildRawAnalyticsRows(headers, requestedDimensions),
    };
  }

  buildRawAnalyticsHeaders = requestedDimensions => {
    const headerList = Object.values(HEADERS);
    const baseHeaders = headerList.filter(({ meta }) => !meta);
    const metadataHeaders = headerList.filter(({ meta }) => !!meta);

    const requestedMetadataHeaders = Object.keys(requestedDimensions)
      .map(dimensionKey => metadataHeaders[dimensionKey])
      .filter(x => x);

    // DHIS2 adds Base headers to the end
    return requestedMetadataHeaders.concat(baseHeaders);
  };

  buildRawAnalyticsRows = (headers, requestedDimensions) => {
    const requestedElements = requestedDimensions.dx || [];
    const requestedOrgUnits = requestedDimensions.ou || [];
    const hasRequestedCoCombo = !!requestedDimensions.co;

    // TODO assert element existence and required params are passed in

    // TODO also filter by period and org unit
    const dataValues = this.data[RESOURCES.DATA_VALUE].filter(({ dataElement }) =>
      requestedDimensions.includes(dataElement),
    );

    return dataValues.map(({ orgUnitCode, dataElementCode, value }) => {
      const dataElement = this.dataMaps.dataElementByCode[dataElementCode];
      const orgUnit = this.dataMaps.orgUnitDataByCode[orgUnitCode];

      return headers.map(header => {});
    });
  };

  buildRawAnalyticsRow = (query, headers, dataValue) =>
    headers.map(header => {
      switch (header) {
        case 'pestartdate':
          return '';
        case 'peenddate':
          return '';
        case 'value':
          return '';
        case 'dx': {
          const { dataElementCode } = dataValue;
          const dataElement = this.dataMaps.dataElementByCode[dataElementCode];
          // TODO check for data element existence?
          return dataElement.code;
        }
        case 'co':
          return ''; // TODO
        case 'ou': {
          const { orgUnitCode } = dataValue;
          const orgUnit = this.dataMaps.orgUnitByCode[orgUnitCode];
          // TODO check for org unit existence
          return query.orgUnitIdScheme === 'code' ? orgUnit.code : orgUnit.id;
        }
        case 'pe':
          return '';
        default:
          throw new Error(`Invalid header ${header}`);
      }
    });
}
