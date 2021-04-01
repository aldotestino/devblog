import Head from 'next/head';
import Link from 'next/link';
import { Stack, FormControl, InputGroup, InputLeftElement, Input, FormErrorMessage, Text, Button, Flex, Box, Heading, Link as Clink } from '@chakra-ui/react';
import { LockIcon, ViewIcon, AtSignIcon, EmailIcon } from '@chakra-ui/icons';
import { Formik, Form, Field } from 'formik';

const initialValues = {
  email: '',
  name: '',
  surname: '',
  password: '',
  avatar: '',
};

function Signup() {
  return (
    <div>
      <Head>
        <title>devBlog - signup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex align="center" mt={['16', '16', '32']} direction="column">
        <Box>
          <Heading mb="4" fontStyle="italic" textAlign="center">Signu up</Heading>
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

                <FormControl isInvalid={formik.touched.name && !!formik.errors.name}>
                  <InputGroup>
                    <InputLeftElement>
                      <AtSignIcon />
                    </InputLeftElement>
                    <Input as={Field} type="text" placeholder="Nome" name="name" id="name" />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.touched.surname && !!formik.errors.surname}>
                  <InputGroup>
                    <InputLeftElement>
                      <AtSignIcon />
                    </InputLeftElement>
                    <Input as={Field} type="text" placeholder="Cognome" name="surname" id="surname" />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.surname}</FormErrorMessage>
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

                <FormControl isInvalid={formik.touched.avatar && !!formik.errors.avatar}>
                  <InputGroup>
                    <InputLeftElement>
                      <ViewIcon />
                    </InputLeftElement>
                    <Input as={Field} type="text" placeholder="Avatar" name="avatar" id="avatar" />
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.avatar}</FormErrorMessage>
                </FormControl>

                <Button type="submit" colorScheme="blue">Sign up</Button>
                <Text>Possiedi già un account?&nbsp;
                  <Link href="/login">
                    <Clink color="blue.400">Effettua il login!</Clink>
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

export default Signup;
