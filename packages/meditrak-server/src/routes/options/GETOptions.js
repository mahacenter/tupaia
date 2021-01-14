/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import { GETHandler } from '../GETHandler';
import { assertTupaiaAdminPanelAccess } from '../../permissions';

export class GETOptions extends GETHandler {
  async assertUserHasAccess() {
    await this.assertPermissions(assertTupaiaAdminPanelAccess);
  }

  async findRecordsViaParent(criteria, options) {
    const dbConditions = { 'option.option_set_id': this.parentRecordId, ...criteria };

    return super.findRecords(dbConditions, options);
  }
}