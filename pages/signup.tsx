import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Stack, FormControl, InputGroup, InputLeftElement, Input, FormErrorMessage, Text, Button, Flex, Box, Heading, Link as CLink, useToast } from '@chakra-ui/react';
import { LockIcon, ViewIcon, EmailIcon, AtSignIcon } from '@chakra-ui/icons';
import { Formik, Form, Field } from 'formik';
import { validateSignupVariables } from '../src/utils/authHelpers';
import { gql, useMutation } from '@apollo/client';
import { SignupMutationVariables, SignupMutation } from '../src/__generated__/SignupMutation';
import { useAuth } from '../src/store/User';
import { useEffect } from 'react';

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
        title: 'An error occurred',
        description: 'User already exixst',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
    }
  });

  useEffect(() => {
    if(isAuth) {
      router.push('/');
    }
  }, []);

  return (
    <>
      <Head>
        <title>devBlog - signup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex align="center" direction="column">
        <Box>
          
          <Heading mb="4" fontStyle="italic" textAlign="center">
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
                <Stack spacing="4" w="xs">

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

                  <Field name="email">
                    {({ field }) => 
                      <FormControl isInvalid={formik.touched.email && !!formik.errors.email}>
                        <InputGroup>
                          <InputLeftElement >
                            <EmailIcon />
                          </InputLeftElement>
                          <Input {...field} type="text" placeholder="Email" id="email" />
                        </InputGroup>
                        <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                      </FormControl>}
                  </Field>

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

                  <Field name="password">
                    {({ field }) =>
                      <FormControl isInvalid={formik.touched.password && !!formik.errors.password}>
                        <InputGroup>
                          <InputLeftElement>
                            <LockIcon />
                          </InputLeftElement>
                          <Input {...field} type="password" placeholder="Password" id="password" />
                        </InputGroup>
                        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
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

                  <Button type="submit" colorScheme="blue" isLoading={loading}>Sign up</Button>
                
                  <Text>Already have an account?&nbsp;
                    <Link href="/login" passHref>     
                      <CLink color="blue.400">
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
