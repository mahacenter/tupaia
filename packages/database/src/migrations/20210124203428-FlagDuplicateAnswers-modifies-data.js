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
    DROP TRIGGER answer_trigger ON answer;

    ALTER TABLE answer ADD COLUMN latest_for_day boolean;

    WITH answer_duplicates(id, duplicate_number)
        AS (
          SELECT
            answer.id,
            ROW_NUMBER() OVER (
              PARTITION BY
                entity.code,
                question.code,
                date_part('year', submission_time),
                    date_part('month', submission_time),
                    date_part('day', submission_time)
                ORDER BY
                  survey_response.end_time DESC
            ) AS duplicate_number
            FROM
              survey_response
            JOIN
              answer ON answer.survey_response_id = survey_response.id
            JOIN
              entity ON entity.id = survey_response.entity_id
            JOIN
              question ON question.id = answer.question_id
      )
      UPDATE answer
      SET latest_for_day = true
      FROM answer_duplicates
      WHERE answer.id = answer_duplicates.id AND duplicate_number = 1;
  `);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
