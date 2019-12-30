'use strict';

import { insertObject } from '../migrationUtilities';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const MAP_OVERLAY_ID = 'CD_Measles_Total_Cases_spectrum';

exports.up = async function(db) {
  return insertObject(db, 'mapOverlay', {
    id: MAP_OVERLAY_ID,
    name: 'Total Measles Cases By Facility (heatmap)',
    groupName: 'Communicable Diseases',
    userGroup: 'Tonga Communicable Diseases',
    dataElementCode: 'value',
    displayType: 'spectrum',
    isDataRegional: false,
    measureBuilderConfig: {
      dataValues: {
        CD92: 'Measles',
      },
      programCode: 'CD8',
      dataSourceType: 'custom',
    },
    measureBuilder: 'countEventsPerOrgUnit',
    presentationOptions: {
      scaleType: 'performanceDesc',
    },
    countryCodes: '{TO}',
  });
};

exports.down = function(db) {
  return db.runSql(`DELETE FROM "mapOverlay" WHERE id = '${MAP_OVERLAY_ID}'`);
};

exports._meta = {
  version: 1,
};
