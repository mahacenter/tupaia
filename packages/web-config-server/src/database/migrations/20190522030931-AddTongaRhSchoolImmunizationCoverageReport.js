'use strict';

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

('use strict');

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

exports.up = function(db) {
  return db.runSql(`
    INSERT INTO
      "dashboardReport" ("id", "dataBuilder", "dataBuilderConfig", "viewJson", "dataSources")
    VALUES
      (
        'TO_RH_Validation_IMMS_08',
        'singleColumnTable',
        '{
          "columnTitle": "Number",
          "dataElementCodes": ["IMMS78", "IMMS79", "IMMS79_1", "IMMS79_2", "IMMS80", "IMMS81"],
          "shouldShowTotalsRow": false
        }',
        '{
          "name": "Annual School Immunization Coverage",
          "type": "chart",
          "chartType": "matrix",
          "placeholder": "/static/media/PEHSMatrixPlaceholder.png",
          "periodGranularity": "one_year_at_a_time"
        }',
        '[{ "isDataRegional": false }]'
      );
    UPDATE
      "dashboardGroup"
    SET
      "dashboardReports" = "dashboardReports" || '{ TO_RH_Validation_IMMS_08 }'
    WHERE
      "code" IN (
        'Tonga_Reproductive_Health_Facility_Validation',
        'Tonga_Reproductive_Health_Facility_Validation_DL'
      );
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DELETE FROM "dashboardReport" WHERE "id" = 'TO_RH_Validation_IMMS_08';

    UPDATE
      "dashboardGroup"
    SET
      "dashboardReports" = array_remove("dashboardReports", 'TO_RH_Validation_IMMS_08')
    WHERE
      "code" IN (
        'Tonga_Reproductive_Health_Facility_Validation',
        'Tonga_Reproductive_Health_Facility_Validation_DL'
      );
  `);
};

exports._meta = {
  version: 1,
};

exports._meta = {
  version: 1,
};
