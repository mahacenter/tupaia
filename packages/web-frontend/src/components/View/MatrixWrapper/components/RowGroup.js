/**
 * Tupaia Web
 * Copyright (c) 2019 Beyond Essential Systems Pty Ltd.
 * This source code is licensed under the AGPL-3.0 license
 * found in the LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDownArrowIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import shallowEqual from 'shallowequal';

export default class RowGroup extends Component {
  shouldComponentUpdate(nextProps) {
    const currentProps = this.props;

    // Update if currently expanded as child rows may
    // have updates.
    if (currentProps.isExpanded) {
      return true;
    }

    // Update if expand state is changing.
    if (currentProps.isExpanded !== nextProps.isExpanded) {
      return true;
    }

    return !shallowEqual(nextProps, currentProps, (a, b, key) => {
      if (key) {
        // Skip comparing children property - it always changes and is
        // only relevant when expaneded which is covered above.
        if (key === 'children') {
          return true;
        }

        return a === b;
      }
    });
  }

  getRowElement() {
    return this.rowElement;
  }

  render() {
    const {
      rowId,
      columns,
      children,
      isExpanded,
      depth,
      indentSize,
      categoryLabel,
      startColumn,
      numberOfColumnsPerPage,
      onToggleRowExpanded,
      styles,
    } = this.props;

    const displayedColumnCount = startColumn + numberOfColumnsPerPage;

    return (
      <div style={isExpanded ? styles.categorySectionExpanded : null}>
        <div style={styles.row} ref={element => (this.rowElement = element)}>
          <button
            onClick={() => onToggleRowExpanded(rowId)}
            style={{ paddingLeft: depth * indentSize, ...styles.collapsibleHeader }}
          >
            <DropDownArrowIcon
              style={isExpanded ? styles.collapsibleIcon : styles.collapsibleIconClosed}
            />
            <span style={styles.collapsibleHeaderInner}>{categoryLabel}</span>
          </button>
          <div style={styles.gridCellChangerActive} />
          {columns.slice(startColumn, displayedColumnCount).map((column, index) => (
            <div
              style={column.isGroupHeader ? styles.gridCellChangerActive : styles.gridCell}
              key={`${rowId}-empty-${index}`}
            />
          ))}
          <div style={styles.gridCellChangerActive} />
        </div>
        {children}
      </div>
    );
  }
}

RowGroup.propTypes = {
  rowId: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
  isExpanded: PropTypes.bool,
  depth: PropTypes.number,
  indentSize: PropTypes.number,
  categoryLabel: PropTypes.string,
  startColumn: PropTypes.number,
  numberOfColumnsPerPage: PropTypes.number,
  onToggleRowExpanded: PropTypes.func,
  rowRef: PropTypes.func,
  styles: PropTypes.object,
};
