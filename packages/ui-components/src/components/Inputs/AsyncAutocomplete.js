/*
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

import React, { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';
import PropTypes from 'prop-types';
import { Autocomplete } from './Autocomplete';

/**
 * Custom hook to fetch autocomplete options given a callback function
 */
const useOptions = (fetchOptions, query) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      const data = await fetchOptions(query);

      if (active) {
        setOptions(data);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [fetchOptions, query]);

  return [options, loading];
};

/**
 * Async Autocomplete. Gets options from a resource
 */
export const AsyncAutocomplete = ({
  fetchOptions,
  id,
  label,
  value,
  onChange,
  labelKey,
  placeholder,
  error,
  disabled,
  required,
  helperText,
  muiProps,
}) => {
  const [query, setQuery] = useState('');
  const [options, loading] = useOptions(fetchOptions, query);

  const handleInputChange = useCallback(
    throttle((event, newValue) => {
      setQuery(newValue);
    }, 200),
    [setQuery],
  );

  return (
    <Autocomplete
      id={id}
      options={options}
      label={label}
      labelKey={labelKey}
      value={value}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      required={required}
      helperText={helperText}
      loading={loading}
      onInputChange={handleInputChange}
      muiProps={muiProps}
    />
  );
};

AsyncAutocomplete.propTypes = {
  fetchOptions: PropTypes.func.isRequired,
  label: PropTypes.string,
  value: PropTypes.any,
  id: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  onChange: PropTypes.func,
  labelKey: PropTypes.string,
  placeholder: PropTypes.string,
  muiProps: PropTypes.object,
};

AsyncAutocomplete.defaultProps = {
  label: '',
  labelKey: 'name',
  placeholder: '',
  required: false,
  disabled: false,
  error: false,
  value: undefined,
  onChange: undefined,
  muiProps: undefined,
  id: undefined,
  helperText: undefined,
};