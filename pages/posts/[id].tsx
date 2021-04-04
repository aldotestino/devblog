import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { Avatar, Box, Flex, Heading, Text, Link as CLink, Stack, useToast } from '@chakra-ui/react';
import { initializeApollo } from '../../src/utils/apolloConfig';
import { PostQuery, PostQueryVariables } from '../../src/__generated__/PostQuery';
import Link from 'next/link';
import CommentBox from '../../src/components/CommentBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as BorderHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as FullHeart } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../src/store/User';
import { LikeMutation, LikeMutationVariables } from '../../src/__generated__/LikeMutation';
import LikesBox from '../../src/components/LikesBox';

const POST_QUERY = gql` 
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      description
      content
      createdAt
      user {
        id
        username
        avatar
      }
      likes {
        user {
          id
          username
          avatar
        }
      }
      comments {
        id
        content
        createdAt
        user {
          id
          username
          avatar
        }
      }
    }
  }
`;

const LIKE_MUTATION = gql`
  mutation LikeMutation($postId: ID!) {
    like(postId: $postId)
  }
`;

interface PostProps {
  id: string
}

function Post({ id }: PostProps) {

  const toast = useToast();
  const { data: { post }, refetch } = useQuery<PostQuery, PostQueryVariables>(POST_QUERY, {
    variables: {
      id
    }
  });
  const { isAuth, user } = useAuth(); 
  const [isLiked, setIsLiked] = useState(post.likes.some(l => l.user.id === user?.id));
  const [like] = useMutation<LikeMutation, LikeMutationVariables>(LIKE_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    }
  });

  async function handleLike() {
    if(!isAuth) {
      toast({
        title: 'An error occurred',
        description: 'You have to login to like',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
      return;
    }
    setIsLiked(pL => !pL);
    await like({
      variables: {
        postId: id
      }
    });
    refetch();
  }

  return (
    <Stack spacing="10" direction={['column', 'column', 'row']}>
      <Box w={['full', 'full', 'lg']}>
        <Heading fontStyle="italic">{post.title}</Heading>
        <Text fontSize="2xl">{post.description}</Text>
        <Flex mt="4" align="center">
          <Avatar mr="4" src={post.user.avatar} name={post.user.username} size="lg" />
          <Box>
            <Text fontSize="xl">
                By{' '}
              <CLink color="blue.300">
                <Link href={`/@${post.user.username}`}>
                  {`@${post.user.username}`}
                </Link> 
              </CLink>
            </Text>
            <Text>Posted on {new Date(post.createdAt).toLocaleDateString()}</Text>
          </Box>
        </Flex>
        <Flex mt="4" align="center">
          <FontAwesomeIcon cursor="pointer" onClick={handleLike} size="2x" color={isLiked ? '#FC8181' : '#CBD5E0'} icon={isLiked ? FullHeart : BorderHeart} />
          <LikesBox ml="2" likes={post.likes} />
        </Flex>
        <CommentBox comments={post.comments} postId={post.id} />
      </Box>
      <Box flex="1">
        <Text fontSize="2xl">
          {post.content}
        </Text>
      </Box>
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps<unknown, {id: string}> = async (context) => {
  const apolloClient = initializeApollo();

  const id = context.params.id;

  await apolloClient.query<PostQuery, PostQueryVariables>({
    query: POST_QUERY,
    variables: {
      id
    }
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      id
    },
  };
};

export default Post;