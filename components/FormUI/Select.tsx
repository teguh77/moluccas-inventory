import React, { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useField, useFormikContext } from 'formik';

const SelectWrapper = ({ name, options, ...otherProps }: any) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined' as const,
    onChange: handleChange,
    error: false,
    helperText: null,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }
  return (
    <TextField {...configSelect}>
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {options?.map((item: any) => {
        return (
          <MenuItem
            key={item.id}
            value={item.id}
            style={{ textTransform: 'capitalize' }}
          >
            {item.title}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectWrapper;
