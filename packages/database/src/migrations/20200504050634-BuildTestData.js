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

exports.up = function(db) {
  return db.runSql(`
    DELETE FROM "dashboardGroup" WHERE "dashboardReports"::text LIKE '%10%' AND "organisationUnitCode" = 'DL';
    DELETE FROM "dashboardGroup" 	WHERE
      "organisationLevel" in ('Country', 'District', 'SubDistrict')
      AND "organisationUnitCode" = 'DL' 
      AND name <> 'General';
    DELETE FROM "dashboardGroup" 
      WHERE "organisationLevel" = 'Facility' 
        AND "organisationUnitCode" = 'DL'
        AND "userGroup" <> 'Public'
        AND name <> 'General';
    DELETE FROM "dashboardGroup" 
      WHERE "organisationUnitCode" = 'World';

    UPDATE "dashboardGroup" 
      SET "dashboardReports" = '{18,9}'
      WHERE "organisationLevel" = 'Facility' 
        AND "organisationUnitCode" = 'DL';
  UPDATE "dashboardReport" 
    SET "dataBuilderConfig" = '{"labels": {"DP9": "Inpatient beds", "SS190A": "Blood Transfusions"}, "dataElementCodes": ["SS128", "SS182", "SS190A", "SS192", "SS219", "DP9"]}'
    WHERE "id" = '18';
    DELETE FROM "mapOverlay" WHERE 
      'DL' = ANY("countryCodes")
      AND NOT(id IN ('171', '157'));
    UPDATE entity
      SET bounds = (SELECT bounds FROM entity WHERE name = 'Demo Land')
        WHERE name = 'World';
    UPDATE "dashboardGroup"
      SET "dashboardReports" = '{23,26,13}'
        WHERE "organisationUnitCode" = 'DL' 
          AND name = 'General'
          AND "userGroup" = 'Public'
          AND "organisationLevel" IN ('District', 'SubDistrict', 'Country');
  `);
};

exports.down = function(db) {
  return db.runSql(`
  UPDATE "dashboardGroup"
    SET "dashboardReports" = '{23,19,8,26}'
      WHERE "organisationUnitCode" = 'DL' 
        AND name = 'General'
        AND "userGroup" = 'Public'
        AND "organisationLevel" IN ('District', 'SubDistrict', 'Country');
`);
};

exports._meta = {
  version: 1,
};
