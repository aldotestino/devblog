import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Stack, FormControl, InputGroup, InputLeftElement, Input, FormErrorMessage, Text, Button, Flex, Box, Heading, Link as Clink, useToast } from '@chakra-ui/react';
import { LockIcon, AtSignIcon } from '@chakra-ui/icons';
import { Formik, Form, Field } from 'formik';
import { validateLoginVariables } from '../src/utils/authHelpers';
import { useAuth } from '../src/store/User';
import { gql, useMutation } from '@apollo/client';
import { LoginMutation, LoginMutationVariables } from '../src/__generated__/LoginMutation';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        name
        surname
        email
        username
        avatar
      }
      token
    }
  }
`;

const initialValues: LoginMutationVariables = {
  username: '',
  password: '',
};

function Login() {

  const toast = useToast();
  const router = useRouter();
  const { setUser, isAuth } = useAuth();
  const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, {
    onCompleted: ({ login: { user, token } }) => {
      setUser({
        ...user,
        token
      });
      router.back();
    },
    onError: (e) => {
      toast({
        title: 'An error occurred',
        description: e.message,
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
        <title>devBlog - login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex align="center" direction="column">
        <Box>
          <Heading mb="4" fontStyle="italic" textAlign="center">Login</Heading>
          <Formik
            initialValues={initialValues}
            validate={validateLoginVariables}
            onSubmit={variables => {
              login({
                variables
              });
            }}
          >
            {formik => 
              <Form>
                <Stack spacing="4" w="xs">

                  <Field name="username">
                    {({ field }) => 
                      <FormControl isInvalid={formik.touched.username && !!formik.errors.username}>
                        <InputGroup>
                          <InputLeftElement >
                            <AtSignIcon />
                          </InputLeftElement>
                          <Input {...field} type="text" placeholder="Username" id="username" />
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

                  <Button type="submit" colorScheme="blue" isLoading={loading}>Login</Button>

                  <Text>Don't have an account?&nbsp;          
                    <Link href="/signup">
                      <Clink color="blue.400"> 
                        Sign up Now!
                      </Clink>
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

export default Login;
