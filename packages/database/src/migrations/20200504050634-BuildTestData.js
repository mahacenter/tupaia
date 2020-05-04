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
    DELETE FROM "mapOverlay" WHERE 
      'DL' = ANY("countryCodes")
      AND NOT(id IN ('171', '157');
    UPDATE "dashboardGroup"
      SET "dashboardReports" = '{23,26}'
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
