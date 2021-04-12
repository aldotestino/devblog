import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Stack, Text, Button, Flex, Box, Heading, Link as CLink, useToast, useColorModeValue } from '@chakra-ui/react';
import { LockIcon, AtSignIcon } from '@chakra-ui/icons';
import { Formik, Form } from 'formik';
import { validateLoginVariables } from '../utils/authHelpers';
import { useAuth } from '../store/User';
import { gql, useMutation } from '@apollo/client';
import { LoginMutation, LoginMutationVariables } from '../__generated__/LoginMutation';
import InputField from '../components/InputField';
import { COLOR_SCHEME } from '../styles/theme';

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
      router.push(`/@${user.username}`);
    },
    onError: (e) => {
      toast({
        title: 'Login',
        description: e.message,
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
        <title>devBlog - login</title>
      </Head>

      <Flex align="center" direction="column">
        <Box border="1px" w={['xs', 'md']} borderColor="inherit" transition="background-color .2s ease" bg={bgColor} rounded="lg" p="8">
          <Heading mb="6" fontStyle="italic">Login</Heading>
          <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validate={validateLoginVariables}
            onSubmit={variables => {
              login({
                variables
              });
            }}
          >
            {formik => 
              <Form>
                <Stack spacing="6">
                  <InputField name="username" icon={<AtSignIcon />} errorMessage={formik.errors.username} placeholder="Username" type="text" isInvalid={formik.touched.username && !!formik.errors.username} />
                  <InputField name="password" icon={<LockIcon />} errorMessage={formik.errors.password} placeholder="Password" type="password" isInvalid={formik.touched.password && !!formik.errors.password} />
                  <Button type="submit" colorScheme={COLOR_SCHEME} isLoading={loading}>Login</Button>
                  <Text>Don't have an account?&nbsp;          
                    <Link href="/signup" passHref>
                      <CLink color={`${COLOR_SCHEME}.400`}> 
                        Sign up Now!
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

export default Login;
