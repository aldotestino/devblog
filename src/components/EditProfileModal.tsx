import { AtSignIcon, ViewIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, ModalProps, Stack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useAuth } from '../store/User';
import { COLOR_SCHEME } from '../styles/theme';
import { validateEditProfileVariables } from '../utils/authHelpers';
import { EditProfileMutationVariables } from '../__generated__/EditProfileMutation';
import InputField from './InputField';

interface EditProfileModalProps extends Partial<ModalProps> {
  action: (variables: EditProfileMutationVariables) => void,
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
                  <Stack spacing="6">
                    <Stack direction="row" spacing="4">
                      <InputField name="name" placeholder="Name" errorMessage={formik.errors.name} type="text" isInvalid={formik.touched.name && !!formik.errors.name} />
                      <InputField name="surname" placeholder="Surname" errorMessage={formik.errors.surname} type="text" isInvalid={formik.touched.surname && !!formik.errors.surname} />
                    </Stack>
                    <InputField name="username" icon={<AtSignIcon />} errorMessage={formik.errors.username} placeholder="Username" type="text" isInvalid={formik.touched.username && !!formik.errors.username} />
                    <InputField name="avatar" icon={<ViewIcon />} placeholder="Avatar" errorMessage={formik.errors.avatar} type="text" isInvalid={formik.touched.avatar && !!formik.errors.avatar} />
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button mr="4" type="button" colorScheme="red" onClick={onClose}>Close</Button>
                  <Button colorScheme={COLOR_SCHEME} type="submit" isLoading={isLoading}>Edit</Button>
                </ModalFooter>
              </Form>}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditProfileModal;   