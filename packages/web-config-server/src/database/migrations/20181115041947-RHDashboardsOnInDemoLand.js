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
    INSERT INTO "dashboardGroup"
      ("code", "organisationLevel", "userGroup", "organisationUnitCode", "name", "dashboardReports")
      SELECT "code" || '_DL' as "code", "organisationLevel", "userGroup", 'DL' as "organisationUnitCode", "name", "dashboardReports"
      FROM "dashboardGroup"
      WHERE "userGroup" = 'Tonga Reproductive Health';
  `);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  version: 1,
};
