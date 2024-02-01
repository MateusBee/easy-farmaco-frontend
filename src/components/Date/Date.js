import React from 'react';
import PropTypes from "prop-types";

import DateFnsUtils from '@date-io/date-fns';
//import { isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

//Material components
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
//import { ThemeProvider } from '@material-ui/core/styles';

//import { materialTheme } from './styles';

export default function InputDate({ value, onChange, ...props }) {
  return (
    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
      <KeyboardDatePicker
        autoOk
        disableToolbar
        variant="inline"
        size="small"
        format="dd/MM/yyyy"
        fullWidth
        value={value}
        onChange={onChange}
        // shouldDisableDate={(day) => day.getDay() === 0}
        // animateYearScrolling={false}
        // maxDate={new Date()}
        invalidDateMessage="Data Inválida"
        {...props}
      />
    </MuiPickersUtilsProvider>
  );
}

InputDate.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
  };
