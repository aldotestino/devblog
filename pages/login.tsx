import Head from 'next/head';
import Link from 'next/link';
import { Stack, FormControl, InputGroup, InputLeftElement, Input, FormErrorMessage, Text, Button, Flex, Box, Heading, Link as Clink } from '@chakra-ui/react';
import { LockIcon, ViewIcon, AtSignIcon, EmailIcon } from '@chakra-ui/icons';
import { Formik, Form, Field } from 'formik';

const initialValues = {
  email: '',
  password: '',
};

function Login() {
  return (
    <div>
      <Head>
        <title>devBlog - login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex align="center" mt={['16', '16', '32']} direction="column">
        <Box>
          <Heading mb="4" fontStyle="italic" textAlign="center">Login</Heading>
          <Formik
            initialValues={initialValues}
            onSubmit={values => {
              console.log(values);
            }}
          >
            {formik => <Form>
              <Stack spacing="3" w="xs">

                <FormControl isInvalid={formik.touched.email && !!formik.errors.email}>
                  <InputGroup>
                    <InputLeftElement >
                      <EmailIcon />
                    </InputLeftElement>
                    <Input as={Field} type="text" placeholder="Email" name="email" id="email" />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.touched.password && !!formik.errors.password}>
                  <InputGroup>
                    <InputLeftElement>
                      <LockIcon />
                    </InputLeftElement>
                    <Input as={Field} type="password" placeholder="Password" name="password" id="password" />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>

                <Button type="submit" colorScheme="blue">Login</Button>
                <Text>Non hai un account?&nbsp;
                  <Link href="/signup">
                    <Clink color="blue.400">Registrati ora!</Clink>
                  </Link>
                </Text>
              </Stack>
            </Form>}
          </Formik>
        </Box>
      </Flex>
    </div>
  );
}

export default Login;
