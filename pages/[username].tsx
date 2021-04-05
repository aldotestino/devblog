import { useQuery, gql, useMutation } from '@apollo/client';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Heading, Stack, Text, toast, useDisclosure, useToast } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useMemo } from 'react';
import PostCard from '../src/components/PostCard';
import UpdateProfileModal from '../src/components/UpdateProfileModal';
import { InboxIcon } from '@heroicons/react/outline';
import { useAuth } from '../src/store/User';
import { initializeApollo } from '../src/utils/apolloConfig';
import { UserQuery, UserQueryVariables } from '../src/__generated__/UserQuery';
import { UpdateProfileMutation, UpdateProfileMutationVariables } from '../src/__generated__/UpdateProfileMutation';
import { useRouter } from 'next/router';

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

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfileMutation($name: String!, $surname: String!, $username: String!, $avatar: String) {
    updateProfile(name: $name, surname: $surname, username: $username, avatar: $avatar) {
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

  const [updateProfile, { loading }] = useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UPDATE_PROFILE_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    onCompleted: ({ updateProfile: { name, surname, username, avatar } }) => {
      const prevUsername = user.username;
      setUser(prevUser => ({
        ...prevUser,
        name,
        surname,
        username,
        avatar
      }));

      if(prevUsername !== username) {
        router.replace(`/@${username}`);
      }
    },
    onError: (e) => {
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

  async function action(variables: UpdateProfileMutationVariables) {
    await updateProfile({
      variables
    });
  }

  return(
    <>
      <Head>
        <title>devBlog - {data.user.username}</title>
      </Head>
      <UpdateProfileModal isLoading={loading} isOpen={isOpen} onClose={onClose} action={action} />
      <Stack justify="space-between" spacing="10" direction={['column', 'column', 'row']}>
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
              <Link href="/posts/create">
                <Button variant="outline" colorScheme="blue" leftIcon={<AddIcon />}>
                  New Post        
                </Button>
              </Link>       
              <Button variant="outline" colorScheme="blue" onClick={onOpen} leftIcon={<EditIcon />}>
                Update profile
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