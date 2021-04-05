import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Textarea } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../../src/store/User';
import { PostMutation, PostMutationVariables } from '../../src/__generated__/PostMutation';

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $description: String!, $content: String!) {
    post(title: $title, description: $description, content: $content) {
      id
    }
  }
`;

function validatePostVariables(values: PostMutationVariables): Partial<PostMutationVariables> {
  const errors: Partial<PostMutationVariables> = {};

  if (!values.title) {
    errors.title = 'Campo obbligatorio';
  }

  if (!values.description) {
    errors.description = 'Campo obbligatorio';
  }

  if (!values.content) {
    errors.content = 'Campo obbligatorio';
  }

  return errors;
}

const initialValues = {
  title: '',
  description: '',
  content: '',
};

function CreatePost() {

  const { isAuth, user } = useAuth();
  const router = useRouter();
  const [post, { loading }] = useMutation<PostMutation, PostMutationVariables>(POST_MUTATION, {
    onCompleted: ({ post }) => {
      if(post) {
        console.log(post);
        router.back();
      }
    },
    context: {
      headers: {
        authorization: user?.token
      }
    }
  });

  useEffect(() => {
    if(!isAuth) {
      router.push('/login');
    }
  }, []);

  return (
    <>
      <Head>
        <title>devBlog - New Post</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        <Heading mb="4" fontStyle="italic" textAlign={['center', 'center', 'left']}>Create New Post</Heading>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validate={validatePostVariables}
          onSubmit={variables => {
            post({
              variables
            });
          }}
        >
          {formik => 
            <Form onClick={() => console.log(formik)}>
              <Flex direction={['column', 'column', 'row']} align={['center', 'center', 'flex-start']}>
                <Stack spacing="4" w={['xs', 'md', 'md']} mr={['0', '0', '4']}>
                  <Field name="title">
                    {({ field }) => 
                      <FormControl isInvalid={formik.touched.title && !!formik.errors.title}>
                        <FormLabel>Title</FormLabel>    
                        <Input {...field} type="text" placeholder="Title" id="title" />
                        <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                      </FormControl>}
                  </Field>

                  <Field name="description">
                    {({ field, }) => 
                      <FormControl isInvalid={formik.touched.description && !!formik.errors.description} >
                        <FormLabel>Description</FormLabel>  
                        <Input {...field} type="text" placeholder="Description" id="description" />
                        <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                      </FormControl>}
                  </Field>

                  <Box display={['block', 'block', 'none']}>
                    <Field name="content">
                      {({ field }) => 
                        <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                          <FormLabel>Content</FormLabel>  
                          <Textarea {...field} type="text" placeholder="Content" id="content" />
                          <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                        </FormControl>}
                    </Field>
                  </Box>

                  <Button type="submit" colorScheme="blue" isLoading={loading}>
                    Submit
                  </Button>
                </Stack>

                <Box flex="1" mt={['4', '4', '0']} display={['none', 'none', 'block']} w={['xs', 'md', 'full']}>
                  <Field name="content">
                    {({ field }) => 
                      <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                        <FormLabel>Content</FormLabel>  
                        <Textarea {...field} type="text" placeholder="Content" id="content" />
                        <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                      </FormControl>}
                  </Field>
                </Box>

              </Flex>

            </Form>}
        </Formik>
      </Box>
    </>
  );
}

export default CreatePost;
