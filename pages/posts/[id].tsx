import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { Avatar, Box, Flex, Heading, Text, Link as CLink, Stack, useToast } from '@chakra-ui/react';
import { initializeApollo } from '../../src/utils/apolloConfig';
import { PostQuery, PostQueryVariables } from '../../src/__generated__/PostQuery';
import Link from 'next/link';
import CommentBox from '../../src/components/CommentsBox';
import { HeartIcon as FullHeart } from '@heroicons/react/solid';
import { HeartIcon as OutlineHeart } from '@heroicons/react/outline';
import { useAuth } from '../../src/store/User';
import { LikeMutation, LikeMutationVariables } from '../../src/__generated__/LikeMutation';
import LikesBox from '../../src/components/LikesBox';
import Head from 'next/head';

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
  const { data: { post } } = useQuery<PostQuery, PostQueryVariables>(POST_QUERY, {
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

  const LikeButton = isLiked ? FullHeart : OutlineHeart;

  function handleLike() {
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
    like({
      variables: {
        postId: id
      }
    });
  }

  return (
    <>
      <Head>
        <title>devBlog - @{post.user.username}/{post.title}</title>
      </Head>

      <Stack spacing={['4', '4', '10']} direction={['column', 'column', 'row']}>
        <Box w={['full', 'full', 'lg']}>
          <Heading fontStyle="italic">{post.title}</Heading>
          <Text fontSize="2xl">{post.description}</Text>
          <Flex mt="4" align="center">
            <Avatar mr="4" src={post.user.avatar} name={post.user.username} size="lg" />
            <Box>
              <Text fontSize="xl">
                By{' '}
                <Link href={`/@${post.user.username}`} passHref>
                  <CLink color="blue.400">
                    {`@${post.user.username}`}
                  </CLink>
                </Link> 
              </Text>
              <Text>Posted on {new Date(post.createdAt).toLocaleDateString()}</Text>
            </Box>
          </Flex>
          {/* LIKES AND COMMENTS FOR DESKTOP */}
          <Box display={['none', 'none', 'block']}>
            <Flex mt="4" align="center">
              <LikeButton style={{ width: '40px', height: '40px', color: isLiked ? '#F56565' : '#A0AEC0', cursor: 'pointer' }} onClick={handleLike} />
              <LikesBox ml="2" likes={post.likes} />
            </Flex>
            <CommentBox comments={post.comments} postId={post.id} />
          </Box>
        </Box>
        <Box flex="1">
          <Text fontSize="2xl" bg="gray.200" color="black" p="4" rounded="lg">
            {post.content}
          </Text>
        </Box>
        {/* LIKES AND COMMENTS FOR MOBILE */}
        <Box display={['block', 'block', 'none']}>
          <Flex mt="4" align="center">
            <LikeButton style={{ width: '40px', height: '40px', color: isLiked ? '#F56565' : '#A0AEC0', cursor: 'pointer' }} onClick={handleLike} />
            <LikesBox ml="2" likes={post.likes} />
          </Flex>
          <CommentBox comments={post.comments} postId={post.id} />
        </Box>
      </Stack>
    </>
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