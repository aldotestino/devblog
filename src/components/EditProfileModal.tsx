import { AtSignIcon, ViewIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, ModalProps, FormErrorMessage, InputGroup, Input, FormControl, InputLeftElement, Stack } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useAuth } from '../store/User';
import { validateEditProfileVariables } from '../utils/authHelpers';
import { EditProfileMutationVariables } from '../__generated__/EditProfileMutation';
import { UpdateProfileMutationVariables } from '../__generated__/UpdateProfileMutation';

interface EditProfileModalProps extends Partial<ModalProps> {
  action: (variables: UpdateProfileMutationVariables) => void,
  isLoading: boolean
}

function EditProfileModal({ isOpen, onClose, action, isLoading }: EditProfileModalProps) {

  const { user } = useAuth();

  const initialValues: EditProfileMutationVariables = {
    name: user?.name,
    surname: user?.surname,
    username: user?.username,
    avatar: user?.avatar
  };
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontStyle="italic" fontSize="2xl">Edit Profile</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validate={validateEditProfileVariables}
            onSubmit={variables => {
              action(variables);
            }}
          >
            {formik => 
              <Form>
                <ModalBody>
                  <Stack spacing="4">
                    <Stack direction="row" spacing="4">
                      <Field name="name">
                        {({ field }) => 
                          <FormControl isInvalid={formik.touched.name && !!formik.errors.name}>
                            <Input {...field} type="text" placeholder="Name" id="name" />
                            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                          </FormControl>}
                      </Field>

                      <Field name="surname">
                        {({ field }) => 
                          <FormControl isInvalid={formik.touched.surname && !!formik.errors.surname}>
                            <Input {...field} type="text" placeholder="Surname" id="surname" />
                            <FormErrorMessage>{formik.errors.surname}</FormErrorMessage>
                          </FormControl>}
                      </Field>
                    </Stack>

                    <Field name="username">
                      {({ field }) => 
                        <FormControl isInvalid={formik.touched.username && !!formik.errors.username}>
                          <InputGroup>
                            <InputLeftElement >
                              <AtSignIcon />
                            </InputLeftElement>
                            <Input {...field} placeholder="Username" id="username" />
                          </InputGroup>
                          <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                        </FormControl>}
                    </Field>

                    <Field name="avatar">
                      {({ field }) => 
                        <FormControl isInvalid={formik.touched.avatar && !!formik.errors.avatar}>
                          <InputGroup>
                            <InputLeftElement>
                              <ViewIcon />
                            </InputLeftElement>
                            <Input {...field} type="text" placeholder="Avatar" id="avatar" />
                          </InputGroup>
                          <FormErrorMessage>{formik.errors.avatar}</FormErrorMessage>
                        </FormControl>}
                    </Field>
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button mr="4" type="button" colorScheme="red" onClick={onClose}>Close</Button>
                  <Button colorScheme="blue" type="submit" isLoading={isLoading}>Edit</Button>
                </ModalFooter>
              </Form>}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditProfileModal;   