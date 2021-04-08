import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, Textarea, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../../store/User';
import { PostMutation, PostMutationVariables } from '../../__generated__/PostMutation';

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $description: String!, $content: String!) {
    post(title: $title, description: $description, content: $content) {
      id
    }
  }
`;

export function validatePostVariables(values: PostMutationVariables): Partial<PostMutationVariables> {
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
        router.push(`/@${user.username}`);
      }
    },
    context: {
      headers: {
        authorization: user?.token
      }
    }
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if(!isAuth) {
      router.push('/login');
    }
  }, []);

  return (
    <>
      <Head>
        <title>devBlog - New Post</title>
      </Head>

      <Flex align="center" direction="column">
        
        <Box border="1px" w={['xs', 'md', 'full']} transition="background-color .2s ease" bg={bgColor} borderColor="inherit" rounded="lg" p="8">
          <Heading mb="4" fontStyle="italic">
            Create New Post
          </Heading>
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
              <Form>
                <Stack direction="row" spacing={['0', '0', '10']}>
                  <Stack spacing="4" w={!isMobile ? 'lg' : 'full'}>
                    <Field name="title">
                      {({ field }) => 
                        <FormControl isInvalid={formik.touched.title && !!formik.errors.title}>
                          <FormLabel>Title</FormLabel>  
                          <Input {...field} type="text" placeholder="The title for this post" id="title" />
                          <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                        </FormControl>}
                    </Field>

                    <Field name="description">
                      {({ field }) => 
                        <FormControl isInvalid={formik.touched.description && !!formik.errors.description}>
                          <FormLabel>Description</FormLabel>  
                          <Input {...field} type="description" placeholder="Enter a short description" id="description" />
                          <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                        </FormControl>}
                    </Field>

                    {isMobile && <Field name="content">
                      {({ field }) => 
                        <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                          <FormLabel>Content</FormLabel>  
                          <Textarea {...field} type="text" placeholder="Write your post here" id="content" />
                          <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                        </FormControl>}
                    </Field>}

                    <Button type="submit" colorScheme="blue" isLoading={loading}>
                    Submit  
                    </Button>         
                  </Stack>
                
                  {!isMobile && <Field name="content">
                    {({ field }) => 
                      <FormControl isInvalid={formik.touched.content && !!formik.errors.content}>
                        <FormLabel>Content</FormLabel>  
                        <Textarea {...field} type="text" placeholder="Write your post here" id="content" />
                        <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
                      </FormControl>}
                  </Field>}

                </Stack>
              </Form>}
          </Formik>
        </Box>
      </Flex>
    </>
  );
}

export default CreatePost;
