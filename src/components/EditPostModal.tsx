import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, ModalProps, FormErrorMessage, InputGroup, Input, FormControl, InputLeftElement, Stack, FormLabel, Textarea, useBreakpointValue } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { validatePostVariables } from '../pages/posts/create';
import { EditPostMutationVariables } from '../__generated__/EditPostMutation';

interface EditPostModalProps extends Partial<ModalProps> {
  action: (variables: Partial<EditPostMutationVariables>) => void,
  initialValues: Partial<EditPostMutationVariables>,
  isLoading: boolean
}

function EditProfileModal({ isOpen, onClose, action, initialValues, isLoading }: EditPostModalProps) {

  const isMobile = useBreakpointValue({ base: true, md: false });
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontStyle="italic" fontSize="2xl">Edit this post</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validate={validatePostVariables}
            onSubmit={variables => {
              action(variables);
            }}
          >
            {formik => 
              <Form>
                
                <ModalBody>
                  <Stack direction="row" spacing={['0', '0', '10']}>
                    <Stack spacing="4" w={!isMobile ? 'lg' : 'full'}>
                      <Field name="title">
                        {({ field }) => 
                          <FormControl isInvalid={formik.touched.title && !!formik.errors.title}>
                            <FormLabel>Title</FormLabel>  
                            <Input {...field} type="text" placeholder="The title for this post" id="title" />
                            <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                          </FormControl>}
                      </Field>

                      <Field name="description">
                        {({ field }) => 
                          <FormControl isInvalid={formik.touched.description && !!formik.errors.description}>
                            <FormLabel>Description</FormLabel>  
                            <Input {...field} type="description" placeholder="Enter a short description" id="description" />
                            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                          </FormControl>}
                      </Field>

                      {isMobile && <Field name="content">
                        {({ field }) => 
                          <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                            <FormLabel>Content</FormLabel>  
                            <Textarea {...field} type="text" placeholder="Write your post here" id="content" />
                            <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                          </FormControl>}
                      </Field>}                    
                    </Stack>
              
                    {!isMobile && <Field name="content">
                      {({ field }) => 
                        <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                          <FormLabel>Content</FormLabel>  
                          <Textarea {...field} type="text" placeholder="Write your post here" id="content" />
                          <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                        </FormControl>}
                    </Field>}

                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <Button mr="4" type="button" colorScheme="red" onClick={onClose}>Close</Button>
                  <Button type="submit" colorScheme="blue" isLoading={isLoading}>Edit</Button> 
                </ModalFooter>
              </Form>}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditProfileModal;   