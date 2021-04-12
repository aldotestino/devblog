import { Box, Button, Flex, Stack, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { PostQuery_post_comments } from '../__generated__/PostQuery';
import { CommentMutation, CommentMutationVariables } from '../__generated__/CommentMutation';
import { useAuth } from '../store/User';
import CommentCard from './CommentCard';
import InputField from './InputField';
import { COLOR_SCHEME } from '../styles/theme';

const COMMENT_MUTATION = gql`
  mutation CommentMutation($content: String!, $postId: ID!) {
    comment(content: $content, postId: $postId) {
      id
      content
      createdAt
    }
  }
`;

const initialValues = {
  content: ''
};

interface CommentBoxProps {
  postId: string,
  comments: PostQuery_post_comments[]
}

function CommentBox({ postId, comments }: CommentBoxProps) {

  const { isAuth, user } = useAuth();
  const [updatedComments, setUpdatedComments] = useState<PostQuery_post_comments[]>(comments);
  const toast = useToast();

  const [comment, { loading }] = useMutation<CommentMutation, CommentMutationVariables>(COMMENT_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    onCompleted: ({ comment }) => {
      const newComment: PostQuery_post_comments = {
        ...comment,
        user: {
          __typename: 'User',
          id: user.id,
          username: user.username,
          avatar: user.avatar
        }
      };
      setUpdatedComments(prevComments => [newComment, ...prevComments]);
    }
  });

  function removeFromUI(commentId: string) {
    setUpdatedComments(prevComments => prevComments.filter(({ id }) => id !== commentId));
  }

  return(
    <Box mt="4">
      <Formik
        initialValues={initialValues}
        onSubmit={(variables, { resetForm }) => {
          if(!isAuth) {
            toast({
              title: 'Comment post',
              description: 'You have to login to comment',
              status: 'error',
              duration: 3000,
              position: 'top-right',
              isClosable: true
            });
            return;
          }
          comment({
            variables: {
              content: variables.content.trim(),
              postId
            }
          });
          resetForm();
        }}
      >
        {formik =>
          <Form>
            <InputField name="content" isDisabled={!isAuth} textarea errorMessage={formik.errors.content} type="text" placeholder={!isAuth ? 'Login to comment' : 'Comment this post'} isInvalid={formik.touched.content && !!formik.errors.content} />
            <Flex justify="flex-end">
              <Button type="submit" isDisabled={!isAuth || formik.values.content.trim() === ''} colorScheme={COLOR_SCHEME} isLoading={loading}>
                Submit
              </Button>
            </Flex>
          </Form>}
      </Formik>
      <Stack mt="4" spacing="4">
        {updatedComments.map(c => <CommentCard removeFromUI={removeFromUI} comment={c} key={c.id} />)}
      </Stack>
    </Box>
  );
}

export default CommentBox;