import React from 'react';
import TextField from '@mui/material/TextField';
import { useField } from 'formik';

const TextFieldWrapper = ({ name, ...otherProps }: any) => {
  const [field, meta] = useField(name);

  const configTextField = {
    ...field,
    ...otherProps,
    variant: 'outlined' as const,
    error: false,
    fullWidth: true,
    size: 'small' as const,
    helperText: null,
    margin: 'normal' as const,
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }
  return <TextField {...configTextField} />;
};

export default TextFieldWrapper;
