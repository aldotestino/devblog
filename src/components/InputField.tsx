import { FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Textarea } from '@chakra-ui/react';
import { Field } from 'formik';
import React, { ReactNode } from 'react';
import { COLOR_SCHEME } from '../styles/theme';

export interface InputFieldProps {
  name: string
  isInvalid: boolean
  label?: string
  type: string
  placeholder: string
  errorMessage: string
  icon?: ReactNode
  textarea?: boolean,
  isDisabled?: boolean
}

function InputField({ name, isInvalid, label, type, placeholder, errorMessage, icon, textarea = false, isDisabled }: InputFieldProps) {

  // Allowing TextArea only if icon is not present
  const InputElement = textarea && !icon ? Textarea : Input;

  return (
    <Field name={name}>
      {({ field }) => 
        <FormControl isInvalid={isInvalid}>
          {label && <FormLabel>{label}</FormLabel>}
          {!icon ? 
            <InputElement focusBorderColor={`${COLOR_SCHEME}.400`} isDisabled={isDisabled} {...field} type={type} placeholder={placeholder} id={name} /> 
            : 
            <InputGroup>
              <InputLeftElement >
                {icon}
              </InputLeftElement>
              <InputElement {...field} focusBorderColor={`${COLOR_SCHEME}.400`} isDisabled={isDisabled} type={type}placeholder={placeholder} id={name} />
            </InputGroup>
          }
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        </FormControl>}
    </Field>
  );
}


export default InputField;