import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AppBar from '@mui/material/AppBar';

type Props = {
  selectedDate: any;
  setSelectedDate: (value: Date) => void;
};

const MobileAppbar = ({ selectedDate, setSelectedDate }: Props) => {
  return (
    <AppBar
      position="fixed"
      style={{
        padding: '0.8rem 1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #00000020',
      }}
      elevation={0}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={['year']}
            label="Tahun"
            value={selectedDate}
            onChange={(newValue: any) => {
              setSelectedDate(newValue);
            }}
          />
        </LocalizationProvider>
      </div>
    </AppBar>
  );
};

export default MobileAppbar;
