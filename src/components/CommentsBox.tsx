import { Box, Button, Flex, Stack, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { PostQuery, PostQueryVariables, PostQuery_post_comments } from '../__generated__/PostQuery';
import { CommentMutation, CommentMutationVariables } from '../__generated__/CommentMutation';
import { useAuth } from '../store/Auth';
import CommentCard from './CommentCard';
import InputField from './InputField';
import { COLOR_SCHEME } from '../styles/theme';
import { POST_QUERY } from '../pages/posts/[id]';

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
  const toast = useToast();

  const [comment, { loading }] = useMutation<CommentMutation, CommentMutationVariables>(COMMENT_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    update: (cache, { data: { comment } }) => {
      // read the post query
      const { post } = cache.readQuery<PostQuery, PostQueryVariables>({
        query: POST_QUERY,
        variables: {
          id: postId
        }
      });
      const newComment: PostQuery_post_comments = {
        ...comment,
        user: {
          __typename: 'User',
          id: user.id,
          username: user.username,
          avatar: user.avatar
        }
      };
      // add `newComment` to the comments array of the post
      cache.writeQuery<PostQuery, PostQueryVariables>({
        query: POST_QUERY,
        variables: {
          id: postId
        },
        data: {
          post: {
            ...post,
            comments: [newComment, ...post.comments]
          }  
        }
      });
    },
  });

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
        {comments.map(c => <CommentCard postId={postId} comment={c} key={c.id} />)}
      </Stack>
    </Box>
  );
}

export default CommentBox;