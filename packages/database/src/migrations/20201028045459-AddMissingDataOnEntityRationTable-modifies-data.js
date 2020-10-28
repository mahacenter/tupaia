'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.runSql(`
      INSERT INTO entity_relation ("id", "parent_id", "child_id", "entity_hierarchy_id")
      values('5efe57ea61f76a14930ff04b',
            (select id from entity where name = 'Bureta (Ovalau Island) Catchment'),
            (select id from entity where name = 'Waivivia (Tukuta)'),
            (select id from entity_hierarchy where name = 'wish'))
  `);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
