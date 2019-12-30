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
  UPDATE "dashboardReport"
  SET "dataBuilderConfig" = "dataBuilderConfig" || '{"labels": {"DP9": "Inpatient beds"}, "dataElementCodes":  [ "SS128", "SS182", "SS190", "SS192", "SS219", "DP9" ] }'
  WHERE id = '18';
  `);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  version: 1,
};
