import { useQuery, gql } from '@apollo/client';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import PostCard from '../src/components/PostCard';
import { useAuth } from '../src/store/User';
import { initializeApollo } from '../src/utils/apolloConfig';
import { UserQuery, UserQueryVariables } from '../src/__generated__/UserQuery';

const USER_QUERY = gql`
  query UserQuery($username: String!) {
    user(username: $username) {
      id
      username
      email
      name
      surname
      avatar
      posts {
        id
        title
        description
        content
        likes {
          user {
            avatar
            username
          }
        }
      }
    }
  }
`;

interface UserPageProps {
  username: string
}

function UserProfile({ username } : UserPageProps) {

  const { isAuth, user } = useAuth();
  const { data } = useQuery<UserQuery, UserQueryVariables>(USER_QUERY, {
    variables: {
      username
    }
  });

  return(
    <>
      <Head>
        <title>devBlog - {data.user.username}</title>
      </Head>
      <Stack justify="space-between" spacing="10" direction={['column', 'column', 'row']}>
        <Box>
          <Flex>
            <Avatar src={data.user.avatar} name={data.user.username} size="2xl" mr="4"/>
            <Box>
              <Heading>
                {data.user.name} {data.user.surname}
              </Heading>
              <Text fontSize="2xl">
              @{data.user.username}
              </Text>
              <Text fontSize="lg">
                {data.user.posts.length} Posts
              </Text>
            </Box>
          </Flex>
          {isAuth && user.id === data.user.id && 
            <Stack spacing="4" mt="4" direction="row">
              <Link href="/posts/create">
                <Button variant="outline" colorScheme="blue" leftIcon={<AddIcon />}>
                New Post
                </Button>
              </Link>
              <Button variant="outline" colorScheme="blue" leftIcon={<EditIcon />}>
                Update profile
              </Button>
            </Stack>}
        </Box>
        <Flex flex="1" justify="center">
          {data.user.posts.length === 0 ? 
            <Flex direction="column" align="center">
              <FontAwesomeIcon size="8x" color="#1A202C" icon={faInbox} />
              <Text mt="4" fontSize="2xl" fontStyle="italic">No posts yet...</Text>
            </Flex>
            : <Stack spacing="4" w="full">
              {data.user.posts.map(p => <PostCard key={p.id} post={p} />)}
            </Stack>}
        </Flex>
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<unknown, {username: string}> = async (context) => {
  const apolloClient = initializeApollo();

  const username = context.params.username.substring(1);

  await apolloClient.query<UserQuery, UserQueryVariables>({
    query: USER_QUERY,
    variables: {
      username
    }
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      username
    },
  };
};


export default UserProfile;