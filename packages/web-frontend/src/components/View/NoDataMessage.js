/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { BLUE, TUPAIA_ORANGE } from '../../styles';
import { VIEW_CONTENT_SHAPE } from './propTypes';

export const NoDataMessage = ({ viewContent }) => {
  const style = { color: BLUE };
  let message = 'No data';

  if (viewContent.noDataMessage) {
    message = viewContent.noDataMessage;
  } else if (viewContent.source === 'mSupply') {
    style.color = TUPAIA_ORANGE;
    message = 'Requires mSupply';
  } else if (viewContent.startDate && viewContent.endDate) {
    message = `No data for ${viewContent.startDate} to ${viewContent.endDate}`;
  }

  return <span style={style}>{message}</span>;
};

NoDataMessage.propTypes = {
  viewContent: PropTypes.shape(VIEW_CONTENT_SHAPE).isRequired,
};
