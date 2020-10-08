/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

// canonical hierarchy splits into two children at each of two generations
//          a
//    aa         ab
// aaa  aab   aba  abb
const ENTITIES = [
  { id: 'entity_a_test', name: 'Entity A', parent_id: null },
  { id: 'entity_aa_test', name: 'Entity AA', parent_id: 'entity_a_test' },
  { id: 'entity_ab_test', name: 'Entity AB', parent_id: 'entity_a_test' },
  { id: 'entity_aaa_test', name: 'Entity AAA', parent_id: 'entity_aa_test' },
  { id: 'entity_aab_test', name: 'Entity AAB', parent_id: 'entity_aa_test' },
  { id: 'entity_aba_test', name: 'Entity ABA', parent_id: 'entity_ab_test' },
  { id: 'entity_abb_test', name: 'Entity ABB', parent_id: 'entity_ab_test' },
];

// two hierarchies to play with
const ENTITY_HIERARCHIES = [{ id: 'hierarchy_a_test' }, { id: 'hierarchy_b_test' }];

// a project for each of the two hierarchies
const PROJECTS = [
  {
    code: 'project_a_test',
    entity_id: 'entity_a_test',
    entity_hierarchy_id: 'hierarchy_a_test',
  },
  {
    code: 'project_b_test',
    entity_id: 'entity_a_test',
    entity_hierarchy_id: 'hierarchy_b_test',
  },
];

// - project a follows the canonical hierarchy exactly
// - project b moves the ab subtree to live below aa, to replace aaa and aab, and then aaa below
//   aba, and aab below abb
//      a
//      aa
//      ab
//   aba  abb
//   aaa  aab
const ENTITY_RELATIONS = [
  {
    parent_id: 'entity_a_test',
    child_id: 'entity_aa_test',
    entity_hierarchy_id: 'hierarchy_b_test',
  },
  {
    parent_id: 'entity_aa_test',
    child_id: 'entity_ab_test',
    entity_hierarchy_id: 'hierarchy_b_test',
  },
  {
    parent_id: 'entity_aba_test',
    child_id: 'entity_aaa_test',
    entity_hierarchy_id: 'hierarchy_b_test',
  },
  {
    parent_id: 'entity_abb_test',
    child_id: 'entity_aab_test',
    entity_hierarchy_id: 'hierarchy_b_test',
  },
];

export const TEST_DATA = {
  entity: ENTITIES,
  entityHierarchy: ENTITY_HIERARCHIES,
  project: PROJECTS,
  entityRelation: ENTITY_RELATIONS,
};

// For ease of reading, we store the expected relations in the format
// [ancestor_id, descendant_id, generational_distance]
// These utils will convert them to more full ancestor_descendant_relation records
// e.g.
// [['a', 'aa', 1], ['a', 'aaa', 2]]
// ->
// [
//   {
//     ancestor_id: 'entity_a_test',
//     descendant_id: 'entity_aa_test',
//     generational_distance: 1,
//   },
//   {
//     ancestor_id: 'entity_a_test',
//     descendant_id: 'entity_aaa_test',
//     generational_distance: 2,
//   },
// ];
const entityLettersToId = letters => `entity_${letters}_test`;
const expandEntityRelations = relations =>
  relations.map(r => ({
    ancestor_id: entityLettersToId(r[0]),
    descendant_id: entityLettersToId(r[1]),
    generational_distance: r[2],
  }));

//          a
//    aa         ab
// aaa  aab   aba  abb
export const INITIAL_HIERARCHY_A = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 1],
  ['a', 'aaa', 2],
  ['a', 'aab', 2],
  ['a', 'aba', 2],
  ['a', 'abb', 2],
  // ancestor entity aa
  ['aa', 'aaa', 1],
  ['aa', 'aab', 1],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'abb', 1],
]);

//      a
//      aa
//      ab
//   aba  abb
//   aaa  aab
export const INITIAL_HIERARCHY_B = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 2],
  ['a', 'aba', 3],
  ['a', 'abb', 3],
  ['a', 'aaa', 4],
  ['a', 'aab', 4],
  // ancestor entity aa
  ['aa', 'ab', 1],
  ['aa', 'aba', 2],
  ['aa', 'abb', 2],
  ['aa', 'aaa', 3],
  ['aa', 'aab', 3],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'abb', 1],
  ['ab', 'aaa', 2],
  ['ab', 'aab', 2],
  // ancestor entity aba
  ['aba', 'aaa', 1],
  // ancestor entity abb
  ['abb', 'aab', 1],
]);

// when aaa is deleted, it just gets taken off the end
//      a
//      aa
//      ab
//   aba  abb
//        aab
export const HIERARCHY_B_AFTER_ENTITY_AAA_DELETED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 2],
  ['a', 'aba', 3],
  ['a', 'abb', 3],
  ['a', 'aab', 4],
  // ancestor entity aa
  ['aa', 'ab', 1],
  ['aa', 'aba', 2],
  ['aa', 'abb', 2],
  ['aa', 'aab', 3],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'abb', 1],
  ['ab', 'aab', 2],
  // ancestor entity abb
  ['abb', 'aab', 1],
]);

// when ab, aba, aaa, and abb are deleted, it just leaves
// a
// aa
// aab
export const HIERARCHY_B_AFTER_MULTIPLE_ENTITIES_DELETED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'aab', 2],
  // ancestor entity aa
  ['aa', 'aab', 1],
]);

// after deleting aba -> aaa, it leaves the rest of the structure intact, and just the aaa leaf
// node has been dropped
//      a
//      aa
//      ab
//   aba  abb
//        aab
export const HIERARCHY_B_AFTER_RELATION_ABA_AAA_DELETED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 2],
  ['a', 'aba', 3],
  ['a', 'abb', 3],
  ['a', 'aab', 4],
  // ancestor entity aa
  ['aa', 'ab', 1],
  ['aa', 'aba', 2],
  ['aa', 'abb', 2],
  ['aa', 'aab', 3],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'abb', 1],
  ['ab', 'aab', 2],
  // ancestor entity abb
  ['abb', 'aab', 1],
]);

// after deleting aa -> ab, it means the canonical structure takes back over below aa, and the ab
// subtree gets left out of the hierarchy altogether
//     a
//    aa
// aaa  aab
export const HIERARCHY_B_AFTER_MULTIPLE_RELATIONS_DELETED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'aaa', 2],
  ['a', 'aab', 2],
  // ancestor entity aa
  ['aa', 'aaa', 1],
  ['aa', 'aab', 1],
]);

// within the canonical hierarchy, the parent_id changes move aaa up to directly below a, and abb
// across to live underneath aaa
//       a
//  aa  ab   aaa
// aab  aba  abb
export const HIERARCHY_A_AFTER_PARENT_ID_CHANGES = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 1],
  ['a', 'aaa', 1],
  ['a', 'aab', 2],
  ['a', 'aba', 2],
  ['a', 'abb', 2],
  // ancestor entity aa
  ['aa', 'aab', 1],
  // ancestor entity ab
  ['ab', 'aba', 1],
  // ancestor entity aaa
  ['aaa', 'abb', 1],
]);

// changing the parent_id of abb to aaa causes the abb -> aab tree to move below aaa, resulting in
// one long path through the entities
// a
// aa
// ab
// aba
// aaa
// abb
// aab
// the update of the parent_id of aaa has no impact, as the entity relation link is used at that
// generation
export const HIERARCHY_B_AFTER_PARENT_ID_CHANGES = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 2],
  ['a', 'aba', 3],
  ['a', 'aaa', 4],
  ['a', 'abb', 5],
  ['a', 'aab', 6],
  // ancestor entity aa
  ['aa', 'ab', 1],
  ['aa', 'aba', 2],
  ['aa', 'aaa', 3],
  ['aa', 'abb', 4],
  ['aa', 'aab', 5],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'aaa', 2],
  ['ab', 'abb', 3],
  ['ab', 'aab', 4],
  // ancestor entity aba
  ['aba', 'aaa', 1],
  ['aba', 'abb', 2],
  ['aba', 'aab', 3],
  // ancestor entity aaa
  ['aaa', 'abb', 1],
  ['aaa', 'aab', 2],
  // ancestor entity abb
  ['abb', 'aab', 1],
]);

// test moves aab to below aa, and ab to below aab, resulting in:
//      a
//      aa
//      aab
//      ab
//   aba  abb
//   aaa
export const HIERARCHY_B_AFTER_MULTIPLE_RELATIONS_CHANGED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'aab', 2],
  ['a', 'ab', 3],
  ['a', 'aba', 4],
  ['a', 'abb', 4],
  ['a', 'aaa', 5],
  // ancestor entity aa
  ['aa', 'aab', 1],
  ['aa', 'ab', 2],
  ['aa', 'aba', 3],
  ['aa', 'abb', 3],
  ['aa', 'aaa', 4],
  // ancestor entity aab
  ['aab', 'ab', 1],
  ['aab', 'aba', 2],
  ['aab', 'abb', 2],
  ['aab', 'aaa', 3],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'abb', 1],
  ['ab', 'aaa', 2],
  // ancestor entity aba
  ['aba', 'aaa', 1],
]);

// adding a new entity relation record between aba and ab means that the canonical links will no
// longer be used, so it will drop the abb subtree
// a
// aa
// ab
// aba
// aaa
export const HIERARCHY_B_AFTER_ENTITY_RELATION_ADDED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 2],
  ['a', 'aba', 3],
  ['a', 'aaa', 4],
  // ancestor entity aa
  ['aa', 'ab', 1],
  ['aa', 'aba', 2],
  ['aa', 'aaa', 3],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'aaa', 2],
  // ancestor entity aba
  ['aba', 'aaa', 1],
]);

// entity abc is created below ab, entity aaaa below aaa, and ac below a
//                 a
//    aa           ab           ac
// aaa  aab   aba  abb  abc     aca
// aaaa
export const HIERARCHY_A_AFTER_ENTITIES_CREATED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 1],
  ['a', 'ac', 1],
  ['a', 'aaa', 2],
  ['a', 'aab', 2],
  ['a', 'aba', 2],
  ['a', 'abb', 2],
  ['a', 'abc', 2],
  ['a', 'aca', 2],
  ['a', 'aaaa', 3],
  // ancestor entity aa
  ['aa', 'aaa', 1],
  ['aa', 'aab', 1],
  ['aa', 'aaaa', 2],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'abb', 1],
  ['ab', 'abc', 1],
  // ancestor entity ac
  ['ac', 'aca', 1],
  // ancestor entity aaa
  ['aaa', 'aaaa', 1],
]);

// entity abc is created below ab, entity aaaa below aaa, and ac below a, and aca below the new ac
// in hierarchy b, the ac subtree is ignored as entity relation links are used at that generation
//         a
//        aa
//        ab
//   aba  abb  abc
//   aaa  aab
//  aaaa
export const HIERARCHY_B_AFTER_ENTITIES_CREATED = expandEntityRelations([
  // ancestor entity a
  ['a', 'aa', 1],
  ['a', 'ab', 2],
  ['a', 'aba', 3],
  ['a', 'abb', 3],
  ['a', 'abc', 3],
  ['a', 'aaa', 4],
  ['a', 'aab', 4],
  ['a', 'aaaa', 5],
  // ancestor entity aa
  ['aa', 'ab', 1],
  ['aa', 'aba', 2],
  ['aa', 'abb', 2],
  ['aa', 'abc', 2],
  ['aa', 'aaa', 3],
  ['aa', 'aab', 3],
  ['aa', 'aaaa', 4],
  // ancestor entity ab
  ['ab', 'aba', 1],
  ['ab', 'abb', 1],
  ['ab', 'abc', 1],
  ['ab', 'aaa', 2],
  ['ab', 'aab', 2],
  ['ab', 'aaaa', 3],
  // ancestor entity aba
  ['aba', 'aaa', 1],
  ['aba', 'aaaa', 2],
  // ancestor entity abb
  ['abb', 'aab', 1],
  // ancestor entity aaa
  ['aaa', 'aaaa', 1],
]);
