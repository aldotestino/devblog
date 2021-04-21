import { Box, FormControl, FormErrorMessage, Tab, TabList, TabPanel, TabPanels, Tabs, Textarea } from '@chakra-ui/react';
import { Field } from 'formik';
import React from 'react';
import Markdown from './Markdown';
import { InputFieldProps } from './InputField';
import { COLOR_SCHEME } from '../styles/theme';

interface InputFiedldWitPreviewProps extends InputFieldProps {
  content: string
}

function InputFieldWithPreview({ isInvalid, errorMessage, content, type, placeholder, name }: InputFiedldWitPreviewProps) {
  return (
    <Tabs colorScheme={COLOR_SCHEME} variant="soft-rounded" flex="1" isLazy>
      <TabList>
        <Tab>Write</Tab>
        <Tab>Preview</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px="0">
          <Field name={name}>
            {({ field }) => 
              <FormControl isInvalid={isInvalid}>
                <Textarea {...field} focusBorderColor={`${COLOR_SCHEME}.400`} h="xs" type={type} placeholder={placeholder} id={name} />
                <FormErrorMessage>{errorMessage}</FormErrorMessage>
              </FormControl>}
          </Field>
        </TabPanel>
        <TabPanel px="0">
          {content && <Box bg="white" p="4" rounded="md" border="1px" borderColor="inherit" shadow="md">
            <Markdown content={content} />
          </Box>}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default InputFieldWithPreview;