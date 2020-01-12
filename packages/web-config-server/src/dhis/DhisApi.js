/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 **/

import { DhisApi as BaseDhisApi } from '@tupaia/dhis-api';
import { Dhis2Error } from '/errors';

export class DhisApi extends BaseDhisApi {
  constructError(message, dhisUrl) {
    return new Dhis2Error({ message }, dhisUrl);
  }
}
