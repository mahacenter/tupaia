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
  // Note that the relevant records on DHIS2 must be deleted first, see Edwin for the deletion sql
  return db.runSql(`
    -- Drop triggers so that all the deletes don't flood the sync queue - have taken care of them manually on dhis2
    DROP TRIGGER IF EXISTS survey_response_trigger
      ON survey_response;
    DROP TRIGGER IF EXISTS answer_trigger
      ON answer;

    CREATE TEMPORARY TABLE duplicate_survey_response (id text) ON COMMIT DROP;
    INSERT INTO duplicate_survey_response (id)
      SELECT a.id
      FROM survey_response a JOIN (
        SELECT MIN(id) as id, entity_id, submission_time
        FROM survey_response
        GROUP BY entity_id, submission_time HAVING COUNT(*) > 1
      ) b
      ON a.entity_id = b.entity_id AND a.submission_time = b.submission_time
      WHERE a.id <> b.id;


    DELETE
    FROM dhis_sync_log
    WHERE record_id IN (SELECT id FROM duplicate_survey_response);

    DELETE
    FROM dhis_sync_queue
    WHERE record_id IN (SELECT id FROM duplicate_survey_response);

    DELETE
    FROM answer
    WHERE survey_response_id IN (SELECT id FROM duplicate_survey_response);

    DELETE
    FROM survey_response
    WHERE id IN (SELECT id FROM duplicate_survey_response);

    -- Recreate triggers
    CREATE TRIGGER survey_response_trigger
      AFTER INSERT OR UPDATE or DELETE
      ON survey_response
      FOR EACH ROW EXECUTE PROCEDURE notification();
    CREATE TRIGGER answer_trigger
      AFTER INSERT OR UPDATE or DELETE
      ON answer
      FOR EACH ROW EXECUTE PROCEDURE notification();
  `);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  version: 1,
};
