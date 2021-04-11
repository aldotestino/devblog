import { useQuery, gql, useMutation } from '@apollo/client';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Heading, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useMemo } from 'react';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import { InboxIcon } from '@heroicons/react/outline';
import { useAuth } from '../store/User';
import { initializeApollo } from '../utils/apolloConfig';
import { UserQuery, UserQueryVariables } from '../__generated__/UserQuery';
import { useRouter } from 'next/router';
import { EditProfileMutation, EditProfileMutationVariables } from '../__generated__/EditProfileMutation';
import { COLOR_SCHEME } from '../styles/theme';
import prisma from '../lib/prisma';

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
        createdAt
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

const EDIT_PROFILE_MUTATION = gql`
  mutation EditProfileMutation($name: String!, $surname: String!, $username: String!, $avatar: String) {
    editProfile(name: $name, surname: $surname, username: $username, avatar: $avatar) {
      name
      surname
      username
      avatar
    }
  } 
`;

interface UserPageProps {
  username: string
}

function UserProfile({ username } : UserPageProps) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuth, user, setUser } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const { data } = useQuery<UserQuery, UserQueryVariables>(USER_QUERY, {
    variables: {
      username
    }
  });

  const [editProfile, { loading }] = useMutation<EditProfileMutation, EditProfileMutationVariables>(EDIT_PROFILE_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    onCompleted: ({ editProfile: { name, surname, username, avatar } }) => {
      const prevUsername = user.username;
      setUser(prevUser => ({
        ...prevUser,
        name,
        surname,
        username,
        avatar
      }));
      onClose();
      if(prevUsername !== username) {
        router.replace(`/@${username}`);
      }
    },
    onError: () => {
      toast({
        title: 'An error occurred',
        description: 'This username is already in use',
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
    }
  });

  const isMe = useMemo(() => isAuth && user.id === data.user.id, [data, user]);

  function action(variables: EditProfileMutationVariables) {
    editProfile({
      variables
    });
  }

  return(
    <>
      <Head>
        <title>devBlog - {data.user.username}</title>
      </Head>
      
      <EditProfileModal isLoading={loading} isOpen={isOpen} onClose={onClose} action={action} />
      <Stack spacing="10" direction={['column', 'column', 'row']}>
        <Box>
          <Flex>
            <Avatar src={isMe ? user.avatar : data.user.avatar} name={isMe ? user.username : data.user.username} size="2xl" mr="4"/>
            <Box>
              <Heading>
                {isMe ? user.name : data.user.name} {isMe ? user.surname : data.user.surname}
              </Heading>
              <Text fontSize="2xl">
              @{isMe ? user.username : data.user.username}
              </Text>
              <Text fontSize="lg">
                {data.user.posts.length} Posts
              </Text>
            </Box>
          </Flex>
          {isMe && 
            <Stack spacing="4" mt="4" direction="row">
              <Link href="/posts/create" passHref>
                <Button variant="outline" as="a" colorScheme={COLOR_SCHEME} leftIcon={<AddIcon />}>
                  New Post        
                </Button>
              </Link>       
              <Button variant="outline" colorScheme={COLOR_SCHEME} onClick={onOpen} leftIcon={<EditIcon />}>
                Edit profile
              </Button>
            </Stack>}
        </Box>
        <Flex flex="1" justify="center">
          {data.user.posts.length === 0 ? 
            <Flex direction="column" align="center">
              <InboxIcon />
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

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    select: {
      username: true
    }
  });

  return {
    paths: users.map(u => ({ params: { username: `@${u.username}` } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<unknown, {username: string}> = async (context) => {
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