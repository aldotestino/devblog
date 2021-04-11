import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, ModalProps, Stack, useBreakpointValue } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { validatePostVariables } from '../pages/posts/create';
import { EditPostMutationVariables } from '../__generated__/EditPostMutation';
import InputFieldWithPreview from './InputFieldWithPreview';
import InputField from './InputField';
import { COLOR_SCHEME } from '../styles/theme';

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
                    <Stack spacing="6" w={isMobile ? 'full' : 'md'}>
                      <InputField name="title" errorMessage={formik.errors.title} isInvalid={formik.touched.title && !!formik.errors.title} label="Title" type="text" placeholder="The title for this post" />
                      <InputField name="description" errorMessage={formik.errors.description} isInvalid={formik.touched.description && !!formik.errors.description} label="Description" type="text" placeholder="Enter a short description" />
                      {isMobile && 
                        <InputFieldWithPreview errorMessage={formik.errors.content} content={formik.values.content} name="content" placeholder="Write your post here" type="text" isInvalid={formik.touched.content && !!formik.errors.content} />
                      }                    
                    </Stack>  
                    {!isMobile && 
                      <InputFieldWithPreview errorMessage={formik.errors.content} content={formik.values.content} name="content" placeholder="Write your post here" type="text" isInvalid={formik.touched.content && !!formik.errors.content} />
                    }
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button mr="4" type="button" colorScheme="red" onClick={onClose}>Close</Button>
                  <Button type="submit" colorScheme={COLOR_SCHEME} isLoading={isLoading}>Edit</Button> 
                </ModalFooter>
              </Form>}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditProfileModal;   