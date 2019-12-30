/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { isMobile } from '../utils';

import Overlay from './mobile/Overlay';
import { DARK_BLUE, MOBILE_MARGIN_SIZE } from '../styles';

export class FormWrapper extends Component {
  render() {
    const { titleText, onClose, style } = this.props;

    if (isMobile()) {
      return (
        <Overlay
          titleText={titleText}
          onClose={onClose}
          style={style}
          contentStyle={styles.mobileContentStyle}
        >
          {this.props.children}
        </Overlay>
      );
    }

    return <div style={style}>{this.props.children}</div>;
  }
}

const styles = {
  mobileContentStyle: {
    background: DARK_BLUE,
    padding: `0 ${MOBILE_MARGIN_SIZE}px`,
    borderTop: '1px solid #111',
  },
};
