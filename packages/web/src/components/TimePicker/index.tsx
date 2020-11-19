import React, { useRef, useEffect } from 'react';

import { PseudoBoxProps as ChakraPseudoBoxProps } from '@chakra-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { useField } from '@unform/core';

import { Container } from './styles';

type TimePickerProps = TextFieldProps & {
  name: string;
  label: string;
  containerProps?: ChakraPseudoBoxProps;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }),
);

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  name,
  containerProps,
}) => {
  const timePickerRef = useRef(null);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: timePickerRef.current,
      path: 'lastElementChild.firstElementChild.value',
    });
  }, [fieldName, registerField]);

  const classes = useStyles();

  return (
    <Container isErrored={!!error} {...containerProps}>
      <TextField
        ref={timePickerRef}
        name={name}
        label={label}
        type="time"
        defaultValue={defaultValue}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{}}
      />
    </Container>
  );
};

export default TimePicker;
