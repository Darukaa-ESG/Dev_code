import React, { FC } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectProps } from '../../Interface/Index';

const SelectComponent: FC<SelectProps> = ({
  onChange,
  value,
  label,
  options,
  multiple = false,
  displayEmpty,
  renderValue,
  placeholder
}) => {
  const shouldShrink =
    value !== null &&
    (multiple ? (Array.isArray(value) && value.length > 0) : Boolean(value))
  return (
    <FormControl fullWidth size="small">
      <InputLabel shrink={shouldShrink || displayEmpty}>{label}</InputLabel>
      <Select
        value={value || (multiple ? [] : '')}
        label={label}
        // placeholder={placeholder}
        onChange={onChange}
        multiple={multiple}
        displayEmpty={displayEmpty}
        renderValue={
          renderValue ||
          ((selected) =>
            multiple
              ? (Array.isArray(selected)
                ? selected
                  .map((val) => options.find((o) => o.value === val)?.label)
                  .join(", ")
                : "")
              : options.find((o) => o.value === selected)?.label || "")
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
