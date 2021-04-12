import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Stack, Text, Button, Flex, Box, Heading, Link as CLink, useToast, useColorModeValue } from '@chakra-ui/react';
import { LockIcon, ViewIcon, EmailIcon, AtSignIcon } from '@chakra-ui/icons';
import { Formik, Form } from 'formik';
import { validateSignupVariables } from '../utils/authHelpers';
import { gql, useMutation } from '@apollo/client';
import { SignupMutationVariables, SignupMutation } from '../__generated__/SignupMutation';
import { useAuth } from '../store/User';
import React, { useEffect } from 'react';
import InputField from '../components/InputField';
import { COLOR_SCHEME } from '../styles/theme';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($name: String!, $surname: String!, $email: String!, $username: String!, $password: String! $avatar: String) {
    signup(name: $name, surname: $surname, email: $email, username: $username password: $password, avatar: $avatar)
  }
`;

const initialValues: SignupMutationVariables = {
  email: '',
  name: '',
  username: '',
  surname: '',
  password: '',
  avatar: '',
};

function Signup() {

  const toast = useToast();
  const router = useRouter();
  const { isAuth } = useAuth();
  const [signup, { loading }] = useMutation<SignupMutation, SignupMutationVariables>(SIGNUP_MUTATION, {
    onCompleted: ({ signup }) => {
      if(signup) {
        toast({
          title: 'Account created',
          description: 'Your account has been succesfully created. Enter your username and password to Login!',
          status: 'success',
          duration: 3000,
          position: 'top-right',
          isClosable: true
        });
      }
      router.push('/login');
    },
    onError: () => {
      toast({
        title: 'Signup',
        description: 'User already exixst',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
    }
  });

  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if(isAuth) {
      router.push('/');
    }
  }, []);

  return (
    <>
      <Head>
        <title>devBlog - signup</title>
      </Head>

      <Flex align="center" direction="column">
        <Box w={['xs', 'md']} border="1px" bg={bgColor} transition="background-color .2s ease" borderColor="inherit" rounded="lg" p="8">     
          <Heading mb="6" fontStyle="italic">
            Sign up
          </Heading>
          <Formik
            initialValues={initialValues}
            validate={validateSignupVariables}
            validateOnBlur={false}
            onSubmit={variables => {
              signup({
                variables
              });
            }}
          >
            {formik => 
              <Form>
                <Stack spacing="6">
                  <Stack direction="row" spacing="4">
                    <InputField name="name" placeholder="Name" errorMessage={formik.errors.name} type="text" isInvalid={formik.touched.name && !!formik.errors.name} />
                    <InputField name="surname" placeholder="Surname" errorMessage={formik.errors.surname} type="text" isInvalid={formik.touched.surname && !!formik.errors.surname} />
                  </Stack>
                  <InputField name="email" icon={<EmailIcon />} placeholder="Email" errorMessage={formik.errors.email} type="text" isInvalid={formik.touched.email && !!formik.errors.email} />
                  <InputField name="username" icon={<AtSignIcon />} errorMessage={formik.errors.username} placeholder="Username" type="text" isInvalid={formik.touched.username && !!formik.errors.username} />
                  <InputField name="password" icon={<LockIcon />} placeholder="Password" errorMessage={formik.errors.password} type="password" isInvalid={formik.touched.password && !!formik.errors.password} />
                  <InputField name="avatar" icon={<ViewIcon />} placeholder="Avatar" errorMessage={formik.errors.avatar} type="text" isInvalid={formik.touched.avatar && !!formik.errors.avatar} />
                  <Button type="submit" colorScheme={COLOR_SCHEME} isLoading={loading}>Sign up</Button>
                  <Text>Already have an account?&nbsp;
                    <Link href="/login" passHref>     
                      <CLink color={`${COLOR_SCHEME}.400`}>
                      Login Now!
                      </CLink>
                    </Link>
                  </Text>
                </Stack>
              </Form>}
          </Formik>
        </Box>
      </Flex>
    </>
  );
}

export default Signup;
