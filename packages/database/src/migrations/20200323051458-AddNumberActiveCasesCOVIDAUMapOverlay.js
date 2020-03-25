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
  INSERT INTO "mapOverlay" (	
    "id",	
    "name",	
    "groupName",	
    "userGroup",	
    "dataElementCode",	
    "displayType",	
    "customColors",	
    "isDataRegional",	
    "values",	
    "hideFromMenu",	
    "hideFromPopup",	
    "hideFromLegend",	
    "linkedMeasures",	
    "sortOrder",	
    "measureBuilderConfig",	
    "measureBuilder",	
    "presentationOptions",	
    "countryCodes")	
     
    VALUES (
    'COVID_AU_State_Number_Active_Cases',
    'Number of active cases by state',
    'COVID-19 Australia',
    'Public',
    'value',
    'shaded-spectrum',
    '',
    false,
    '[{"color": "blue", "value": "other"}, {"color": "grey", "value": null}]',
    false,
    false,
    false,
    NULL,
    '0',
    '{"dataSourceEntityType":"region","aggregationEntityType":"region","pipeline":{"query":{"endpoint":"analytics","dataElementCodes":["dailysurvey003","dailysurvey004","dailysurvey005"]},"functions":[{"function":"select","arguments":["dailysurvey003","value"]},{"function":"subtract","arguments":["value","dailysurvey004"]},{"function":"subtract","arguments":["value","dailysurvey005"]}]}}',
    'functionalPipeline',
    '{"scaleType": "performanceDesc"}',
    '{AU}');
  `);
};

exports.down = function(db) {
  return db.runSql(
    `	
    DELETE FROM "mapOverlay" WHERE "id" = 'COVID_AU_State_Number_Active_Cases';	
  `,
  );
};

exports._meta = {
  version: 1,
};
