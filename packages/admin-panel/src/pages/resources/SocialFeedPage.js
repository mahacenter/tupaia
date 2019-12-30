/**
 * Tupaia MediTrak
 * Copyright (c) 2017 Beyond Essential Systems Pty Ltd
 */

import React from 'react';
import { ResourcePage } from './ResourcePage';

const FIELDS = [
  {
    Header: 'Country',
    source: 'country.name',
    editConfig: {
      optionsEndpoint: 'countries',
    },
  },
  {
    Header: 'Permission Group',
    source: 'permission_group.name',
    editConfig: {
      optionsEndpoint: 'permissionGroups',
    },
  },
  {
    Header: 'Creation date',
    source: 'creation_date',
    editConfig: {
      type: 'datetime-local',
    },
  },
  {
    Header: 'Feed item',
    source: 'template_variables',
    editConfig: {
      type: 'json',
      getJsonFieldSchema: () => [
        {
          label: 'Title',
          fieldName: 'title',
        },
        {
          label: 'Image',
          fieldName: 'image',
        },
        {
          label: 'Body (accepts basic markdown)',
          fieldName: 'body',
        },
        {
          label: 'Link',
          fieldName: 'link',
        },
      ],
    },
    Cell: row => {
      if (row.value && row.value.title) {
        return (
          <div>
            <h4>{row.value.title}</h4>
            <img src={row.value.image} alt={row.value.title} />
            <div>{row.value.body}</div>
          </div>
        );
      }

      return null;
    },
  },
];

export const SOCIAL_FEED_COLUMNS = [
  ...FIELDS,
  {
    Header: 'Edit',
    source: 'id',
    type: 'edit',
    actionConfig: {
      editEndpoint: 'feedItem',
      fields: FIELDS,
    },
  },
  {
    Header: 'Delete',
    source: 'id',
    type: 'delete',
    actionConfig: {
      endpoint: 'feedItem',
    },
  },
];

const EDIT_CONFIG = {
  title: 'Edit Social Feed item',
};

const CREATE_CONFIG = {
  title: 'Add Social Feed item',
  actionConfig: {
    editEndpoint: 'feedItem',
    fields: FIELDS,
  },
};

export const SocialFeedPage = () => (
  <ResourcePage
    title="Social Feed"
    endpoint="feedItems"
    columns={SOCIAL_FEED_COLUMNS}
    editConfig={EDIT_CONFIG}
    createConfig={CREATE_CONFIG}
    onProcessDataForSave={data => {
      data.type = 'markdown'; // eslint-disable-line no-param-reassign
    }}
  />
);
