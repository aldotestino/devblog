import { AtSignIcon, ViewIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, ModalProps, FormErrorMessage, InputGroup, Input, FormControl, InputLeftElement, Stack } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useAuth } from '../store/User';
import { validateUpdateProfileVariables } from '../utils/authHelpers';
import { UpdateProfileMutationVariables } from '../__generated__/UpdateProfileMutation';

interface UpdateProfileModalProps extends Partial<ModalProps> {
  action: (variables: UpdateProfileMutationVariables) => void,
  isLoading: boolean
}

function UpdateProfileModal({ isOpen, onClose, action, isLoading }: UpdateProfileModalProps) {

  const { user } = useAuth();

  const initialValues: UpdateProfileMutationVariables = {
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
          <ModalHeader fontStyle="italic" fontSize="2xl">Update Profile</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validate={validateUpdateProfileVariables}
            onSubmit={async variables => {
              await action(variables);
              onClose();
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
                  <Button mr="4" type="button" colorScheme="red" onClick={onClose}>Annulla</Button>
                  <Button colorScheme="blue" type="submit" isLoading={isLoading}>Aggiorna</Button>
                </ModalFooter>
              </Form>}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateProfileModal;   