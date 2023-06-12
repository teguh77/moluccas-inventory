import React, { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import TextField from '@/components/FormUI/TextField';

export const handleValueChange =
  (name: any, setFieldValue: any) => (val: any) =>
    setFieldValue(name, val.floatValue);

const CurrencyFieldText = ({ currencySymbol, ...props }: any) => {
  const [displayValue, setDisplayValue] = useState();
  return (
    <>
      <NumericFormat
        customInput={TextField}
        variant="outlined"
        isNumericString
        thousandSeparator
        value={displayValue}
        decimalScale={2}
        onValueChange={(vals: any) => setDisplayValue(vals.formattedValue)}
        InputProps={{
          startAdornment: <span>{currencySymbol} </span>,
        }}
        {...props}
      />
    </>
  );
};

CurrencyFieldText.defaultProps = {
  currencySymbol: 'Rp. ',
};

export default CurrencyFieldText;
