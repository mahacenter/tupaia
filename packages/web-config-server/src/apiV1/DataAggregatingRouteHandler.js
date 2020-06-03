/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { createAggregator } from '@tupaia/aggregator';
import { RouteHandler } from './RouteHandler';
import { Aggregator } from '/aggregator';
import { Project } from '/models';
import { filterEntities } from './utils';

const DEFAULT_ENTITY_AGGREGATION_TYPE = Aggregator.aggregationTypes.REPLACE_ORG_UNIT_WITH_ORG_GROUP;

/**
 * Interface class for handling routes that fetch data from an aggregator
 * buildResponse must be implemented
 */
export class DataAggregatingRouteHandler extends RouteHandler {
  constructor(req, res) {
    super(req, res);
    this.aggregator = createAggregator(Aggregator, this);
  }

  // Builds the list of entities data should be fetched from, using org unit descendents of the
  // selected entity (optionally of a specific entity type)
  fetchDataSourceEntities = async (entity, dataSourceEntityType, dataSourceEntityFilter) => {
    // if a specific type was specified in either the query or the function parameter, build org
    // units of that type (otherwise we just use the nearest org unit descendants)

    const entityType = dataSourceEntityType || this.query.dataSourceEntityType;
    const hierarchyId = (await Project.findOne({ code: this.query.projectCode }))
      .entity_hierarchy_id;

    let dataSourceEntities = entityType
      ? await entity.getDescendantsOfType(entityType, hierarchyId)
      : await entity.getNearestOrgUnitDescendants(hierarchyId);

    const countryCodes = [...new Set(dataSourceEntities.map(e => e.country_code))];
    const countryAccessList = await Promise.all(
      countryCodes.map(countryCode => this.permissionsChecker.checkHasEntityAccess(countryCode)),
    );
    const countryAccess = countryCodes.reduce(
      (obj, countryCode, i) => ({ ...obj, [countryCode]: countryAccessList[i] }),
      {},
    );
    dataSourceEntities = dataSourceEntities.filter(e => countryAccess[e.country_code]);

    if (dataSourceEntityFilter) {
      dataSourceEntities = filterEntities(dataSourceEntities, dataSourceEntityFilter);
    }

    return dataSourceEntities;
  };

  // Will return a map for every org unit (regardless of type) in orgUnits to its ancestor of type aggregationEntityType
  getOrgUnitToAncestorMap = async (orgUnits, aggregationEntityType) => {
    if (!orgUnits || orgUnits.length === 0) return {};
    const orgUnitToAncestor = {};
    const addOrgUnitToMap = async orgUnit => {
      if (orgUnit && orgUnit.type !== aggregationEntityType) {
        const ancestor = await orgUnit.getAncestorOfType(aggregationEntityType);
        if (ancestor) {
          orgUnitToAncestor[orgUnit.code] = { code: ancestor.code, name: ancestor.name };
        }
      }
    };
    await Promise.all(orgUnits.map(orgUnit => addOrgUnitToMap(orgUnit)));
    return orgUnitToAncestor;
  };

  fetchEntityAggregationConfig = async (
    dataSourceEntities,
    aggregationEntityType,
    entityAggregationType = DEFAULT_ENTITY_AGGREGATION_TYPE,
  ) => {
    if (
      !aggregationEntityType ||
      !dataSourceEntities ||
      dataSourceEntities.length === 0 ||
      // Remove this line to fetch more than 1 type of entity (e.g. whole hierarchy)
      aggregationEntityType === dataSourceEntities[0].type
    )
      return false;
    const orgUnitMap = await this.getOrgUnitToAncestorMap(
      dataSourceEntities,
      aggregationEntityType,
    );
    return { type: entityAggregationType, config: { orgUnitMap } };
  };
}
