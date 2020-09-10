/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { Authenticator } from '@tupaia/auth';
import { buildAndInsertSurveys, findOrCreateDummyRecord } from '@tupaia/database';
import { TUPAIA_ADMIN_PANEL_PERMISSION_GROUP } from '../../../permissions';
import { TestableApp } from '../../TestableApp';
import { expectPermissionError } from '../../testUtilities/expectResponseError';

const DEFAULT_POLICY = {
  DL: ['Public'],
  KI: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Admin', 'Public'],
  SB: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Royal Australasian College of Surgeons'],
  VU: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Admin'],
  LA: ['Admin'],
};

const BES_ADMIN_POLICY = {
  LA: ['BES Admin'],
};

const TEST_DATA_FOLDER = 'src/tests/testData';
const SERVICE_TYPE = 'tupaia';
const EXISTING_TEST_SURVEY_CODE_1 = 'test_existing_survey_import_1';
const EXISTING_TEST_SURVEY_NAME_1 = 'test_existing_survey_import 1';
const EXISTING_TEST_SURVEY_CODE_2 = 'test_existing_survey_import_2';
const EXISTING_TEST_SURVEY_NAME_2 = 'test_existing_survey_import 2';
const NEW_TEST_SURVEY_NAME_1 = 'test_new_survey_import 1';
const NEW_TEST_SURVEY_NAME_2 = 'test_new_survey_import 2';
const NEW_TEST_SURVEY_NAME_3 = 'test_new_survey_import 3';

const prepareStubAndAuthenticate = async (app, policy = DEFAULT_POLICY) => {
  sinon.stub(Authenticator.prototype, 'getAccessPolicyForUser').returns(policy);
  await app.authenticate();
};

describe('importSurveys(): POST import/surveys', () => {
  const app = new TestableApp();
  const models = app.models;
  let vanuatuCountry;
  let kiribatiCountry;

  describe('Test permissions when importing surveys', async () => {
    before(async () => {
      const adminPermissionGroup = await models.permissionGroup.findOne({ name: 'Admin' });
      vanuatuCountry = await models.country.findOne({ code: 'VU' });
      kiribatiCountry = await models.country.findOne({ code: 'KI' });

      const addQuestion = (id, type) =>
        findOrCreateDummyRecord(
          models.question,
          {
            code: id,
          },
          {
            id,
            text: `Test question ${id}`,
            name: `Test question ${id}`,
            type,
          },
        );

      //Questions used for all the surveys
      await addQuestion('fdfuu42a22321c123a8_test', 'FreeText');
      await addQuestion('fdfzz42a66321c123a8_test', 'FreeText');

      await buildAndInsertSurveys(models, [
        {
          code: EXISTING_TEST_SURVEY_CODE_1,
          name: EXISTING_TEST_SURVEY_NAME_1,
          permission_group_id: adminPermissionGroup.id,
          country_ids: [vanuatuCountry.id],
          dataGroup: {
            service_type: 'tupaia',
          },
        },
        {
          code: EXISTING_TEST_SURVEY_CODE_2,
          name: EXISTING_TEST_SURVEY_NAME_2,
          permission_group_id: adminPermissionGroup.id,
          country_ids: [kiribatiCountry.id],
          dataGroup: {
            service_type: 'tupaia',
          },
        },
      ]);
    });

    afterEach(() => {
      Authenticator.prototype.getAccessPolicyForUser.restore();
    });

    describe('Import existing surveys', async () => {
      it('Sufficient permissions - Single survey: Should pass permissions check if user has the survey permission group access to all of the survey countries', async () => {
        const fileName = 'importAnExistingSurvey.xlsx';

        await prepareStubAndAuthenticate(app);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);
        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Sufficient permissions - Single survey: Should pass permissions check if new countries are specified and user has the survey permission group access to the new countries', async () => {
        const fileName = 'importAnExistingSurvey.xlsx';

        await prepareStubAndAuthenticate(app);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&countryIds=${kiribatiCountry.id}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);

        //Revert the countryIds back to Vanuatu for other test cases
        await models.survey.update(
          { code: EXISTING_TEST_SURVEY_CODE_1 },
          { country_ids: [vanuatuCountry.id] },
        );

        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Sufficient permissions - Single survey: Should pass permissions check if users have BES Admin access to any countries', async () => {
        const fileName = 'importAnExistingSurvey.xlsx';

        await prepareStubAndAuthenticate(app, BES_ADMIN_POLICY);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);
        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Sufficient permissions - Multiple surveys: Should pass permissions check if users have both [survey permission group] - [Tupaia Admin Panel] access to all of the survey countries', async () => {
        const fileName = 'importMultipleExistingSurveys.xlsx';

        await prepareStubAndAuthenticate(app);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&surveyNames=${EXISTING_TEST_SURVEY_NAME_2}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);
        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Sufficient permissions - Multiple surveys: Should pass permissions check if users have BES Admin access to any countries', async () => {
        const fileName = 'importMultipleExistingSurveys.xlsx';

        await prepareStubAndAuthenticate(app, BES_ADMIN_POLICY);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&surveyNames=${EXISTING_TEST_SURVEY_NAME_2}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);
        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Insufficient permissions - Single survey: Should not pass permissions check if users do not have the survey permission group access to all of the survey countries', async () => {
        const policy = {
          DL: ['Public'],
          KI: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Admin', 'Public'],
          SB: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Royal Australasian College of Surgeons'],
          VU: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP /*'Admin'*/], //No Admin access to Vanuatu => throw permission error
          LA: ['Admin'],
        };
        const fileName = 'importAnExistingSurvey.xlsx';

        await prepareStubAndAuthenticate(app, policy);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);

        expectPermissionError(response, /Need Admin access to Vanuatu/);
      });

      it('Insufficient permissions - Single survey: Should not pass permissions check if new countries are specified and users do not have the Tupaia Admin Panel access to the new countries', async () => {
        const policy = {
          DL: ['Public'],
          KI: [/*TUPAIA_ADMIN_PANEL_PERMISSION_GROUP*/ 'Admin', 'Public'], //No Tupaia Admin Panel access to newCountry Kiribati => throw permission error
          SB: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Royal Australasian College of Surgeons'],
          VU: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Admin'],
          LA: ['Admin'],
        };
        const fileName = 'importAnExistingSurvey.xlsx';

        await prepareStubAndAuthenticate(app, policy);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&countryIds=${kiribatiCountry.id}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);

        expectPermissionError(response, /Need Tupaia Admin Panel access to Kiribati/);
      });

      it('Insufficient permissions - Multiple surveys: Should not pass permissions check if users do not have both [survey permission group] - [Tupaia Admin Panel] access to all of the survey countries', async () => {
        const fileName = 'importMultipleExistingSurveys.xlsx';
        const policy = {
          DL: ['Public'],
          KI: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Admin', 'Public'],
          SB: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Royal Australasian College of Surgeons'],
          VU: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP /*'Admin'*/], //Will not have Admin access to Vanuatu => throw permission error
          LA: ['Admin'],
        };

        await prepareStubAndAuthenticate(app, policy);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&surveyNames=${EXISTING_TEST_SURVEY_NAME_2}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);

        expectPermissionError(response, /Need Admin access to Vanuatu/);
      });

      it('Insufficient permissions - Multiple surveys: Should not pass permissions check if new countries are specified and users do not have the survey permission group access to the new countries', async () => {
        const fileName = 'importMultipleExistingSurveys.xlsx';
        const policy = {
          DL: ['Public'],
          KI: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Admin', 'Public'],
          SB: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Royal Australasian College of Surgeons'],
          VU: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP /*'Admin'*/], //No Admin access to Vanuatu => throw permission error
          LA: ['Admin'],
        };

        await prepareStubAndAuthenticate(app, policy);

        const response = await app
          .post(
            `import/surveys?surveyNames=${EXISTING_TEST_SURVEY_NAME_1}&surveyNames=${EXISTING_TEST_SURVEY_NAME_2}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);

        expectPermissionError(response, /Need Admin access to Vanuatu/);
      });
    });

    describe('Import new surveys', async () => {
      it('Sufficient permissions - Single Survey: Should pass permissions user have Tupaia Admin Panel access to the specified countries of the new survey', async () => {
        const fileName = 'importANewSurvey.xlsx';

        await prepareStubAndAuthenticate(app);

        const response = await app
          .post(
            `import/surveys?surveyNames=${NEW_TEST_SURVEY_NAME_1}&countryIds=${kiribatiCountry.id}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);
        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Sufficient permissions - Multiple new Surveys: Should pass permissions user have Tupaia Admin Panel access to the specified countries of the new surveys', async () => {
        const fileName = 'importMultipleNewSurveys.xlsx';

        await prepareStubAndAuthenticate(app);

        const response = await app
          .post(
            `import/surveys?surveyNames=${NEW_TEST_SURVEY_NAME_2}&surveyNames=${NEW_TEST_SURVEY_NAME_3}&countryIds=${kiribatiCountry.id}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);
        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Sufficient permissions - Multiple new Surveys: Should pass permissions check if user has BES Admin access to any countries', async () => {
        const fileName = 'importMultipleNewSurveys.xlsx';

        await prepareStubAndAuthenticate(app, BES_ADMIN_POLICY);

        const response = await app
          .post(
            `import/surveys?surveyNames=${NEW_TEST_SURVEY_NAME_2}&surveyNames=${NEW_TEST_SURVEY_NAME_3}&countryIds=${kiribatiCountry.id}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);
        const { statusCode } = response;

        expect(statusCode).to.equal(200);
      });

      it('Insufficient permissions - Multiple new Surveys: Should not pass permissions check if users do not have BES Admin or Tupaia Admin Panel access to the specified countries', async () => {
        const fileName = 'importMultipleNewSurveys.xlsx';
        const policy = {
          DL: ['Public'],
          KI: [/*TUPAIA_ADMIN_PANEL_PERMISSION_GROUP*/ 'Admin', 'Public'], //No Tupaia Admin Panel access to newCountry Kiribati => throw permission error
          SB: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Royal Australasian College of Surgeons'],
          VU: [TUPAIA_ADMIN_PANEL_PERMISSION_GROUP, 'Admin'],
          LA: ['Admin'],
        };

        await prepareStubAndAuthenticate(app, policy);

        const response = await app
          .post(
            `import/surveys?surveyNames=${NEW_TEST_SURVEY_NAME_2}&surveyNames=${NEW_TEST_SURVEY_NAME_3}&countryIds=${kiribatiCountry.id}&serviceType=${SERVICE_TYPE}`,
          )
          .attach('surveys', `${TEST_DATA_FOLDER}/surveys/${fileName}`);

        expectPermissionError(response, /Need Tupaia Admin Panel access to Kiribati/);
      });
    });
  });
});