'use strict';

import { insertObject, generateId, codeToId } from '../utilities';

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

const mahaEntity = {
  id: generateId(),
  code: 'maha',
  name: 'Maha Center',
  type: 'project',
  bounds: 'POLYGON ((-23.2 -1.4, 24.4 -1.4, 24.4 30.3, -23.2 30.3, -23.2 -1.4))',
  attributes: '{}',
};

const mahaEntityHierarchy = {
  id: generateId(),
  name: 'maha',
};

const mahaProject = {
  id: generateId(),
  code: 'maha',
  user_groups: '{Public}',
  entity_id: mahaEntity.id,
  entity_hierarchy_id: mahaEntityHierarchy.id,
  image_url: 'http://www.mahacenter.com/public/frontend/images/logo-dark.png',
};

exports.up = async function (db) {
  await insertObject(db, 'entity', mahaEntity);
  await insertObject(db, 'entity_hierarchy', mahaEntityHierarchy);
  await insertObject(db, 'project', mahaProject);

  await insertObject(db, 'entity_relation', {
    id: generateId(),
    parent_id: mahaEntity.id,
    child_id: await codeToId(db, 'entity', 'LR'),
    entity_hierarchy_id: mahaEntityHierarchy.id,
  });
  await insertObject(db, 'entity_relation', {
    id: generateId(),
    parent_id: mahaEntity.id,
    child_id: await codeToId(db, 'entity', 'GW'),
    entity_hierarchy_id: mahaEntityHierarchy.id,
  });
  await insertObject(db, 'entity_relation', {
    id: generateId(),
    parent_id: mahaEntity.id,
    child_id: await codeToId(db, 'entity', 'GN'),
    entity_hierarchy_id: mahaEntityHierarchy.id,
  });
  await insertObject(db, 'entity_relation', {
    id: generateId(),
    parent_id: mahaEntity.id,
    child_id: await codeToId(db, 'entity', 'GM'),
    entity_hierarchy_id: mahaEntityHierarchy.id,
  });

  return null;
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
