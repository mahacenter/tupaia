/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import { WHITE, PRIMARY_BLUE, BREWER_PALETTE } from '../styles';

export const PrimaryButton = styled(Button)`
  margin: 0 auto;
  color: ${WHITE};
  background: ${PRIMARY_BLUE};
  width: 100%;

  :hover {
    background: ${BREWER_PALETTE.blue};
  }
`;
