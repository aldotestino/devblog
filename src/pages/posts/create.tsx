import { Box, Button, Flex, Heading, Stack, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../../store/Auth';
import { PostMutation, PostMutationVariables } from '../../__generated__/PostMutation';
import InputField from '../../components/InputField';
import InputFieldWithPreview from '../../components/InputFieldWithPreview';
import { COLOR_SCHEME } from '../../styles/theme';
import SEO from '../../components/SEO';

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
  }, [isAuth]);

  return (
    <>
      <SEO title="devBlog - New Post" description="Create a new post" />

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
                  <Stack spacing="6" w={isMobile ? 'full' : 'md'}>
                    <InputField name="title" errorMessage={formik.errors.title} isInvalid={formik.touched.title && !!formik.errors.title} label="Title" type="text" placeholder="The title for this post" />
                    <InputField name="description" errorMessage={formik.errors.description} isInvalid={formik.touched.description && !!formik.errors.description} label="Description" type="text" placeholder="Enter a short description" />
                    {isMobile && 
                      <InputFieldWithPreview errorMessage={formik.errors.content} content={formik.values.content} name="content" placeholder="Write your post here" type="text" isInvalid={formik.touched.content && !!formik.errors.content} />
                    }
                    <Button type="submit" colorScheme={COLOR_SCHEME} isLoading={loading}>
                      Submit  
                    </Button>    
                  </Stack>
                  {!isMobile && 
                    <InputFieldWithPreview errorMessage={formik.errors.content} content={formik.values.content} name="content" placeholder="Write your post here" type="text" isInvalid={formik.touched.content && !!formik.errors.content} />
                  }
                </Stack>
              </Form>}
          </Formik>
        </Box>
      </Flex>
    </>
  );
}

export default CreatePost;
