import { useQuery, gql, useMutation } from '@apollo/client';
import { Avatar, Box, Button, Flex, Heading, Icon, SimpleGrid, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useMemo } from 'react';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import { InboxIcon, PlusIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import { useAuth } from '../store/Auth';
import { initializeApollo } from '../utils/apolloConfig';
import { UserQuery, UserQueryVariables } from '../__generated__/UserQuery';
import { useRouter } from 'next/router';
import { EditProfileMutation, EditProfileMutationVariables } from '../__generated__/EditProfileMutation';
import { COLOR_SCHEME } from '../styles/theme';
import { DeleteProfileMutation } from '../__generated__/DeleteProfileMutation';
import ConfirmActionDialog from '../components/ConfirmActionDialog';
import SEO from '../components/SEO';

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

const DELETE_PROFILE_MUTATION = gql`
  mutation DeleteProfileMutation {
    deleteProfile
  }
`;

interface UserPageProps {
  username: string
}

function UserProfile({ username } : UserPageProps) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: dialogIsOpen, onOpen: dialogOnOpen, onClose: dialogOnClose } = useDisclosure();
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
        title: 'Update Profile',
        description: 'This username is already in use',
        status: 'warning',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
    }
  });

  const [deleteProfile, { loading: deleteProfileLoading }] = useMutation<DeleteProfileMutation>(DELETE_PROFILE_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    onCompleted: ({ deleteProfile }) => {
      if(deleteProfile) {
        dialogOnClose();
        setUser(null);
        router.push('/');
      }
    }
  });

  const isMe = useMemo(() => isAuth && user.id === data.user.id, [data, user]);

  function editProfileAction(variables: EditProfileMutationVariables) {
    editProfile({
      variables
    });
  }

  return(
    <>
      <SEO title={`devBlog - @${data.user.username}`} description={`${data.user.name} ${data.user.surname}`} image={data.user.avatar} />
      
      <EditProfileModal isLoading={loading} isOpen={isOpen} onClose={onClose} action={editProfileAction} />
      <ConfirmActionDialog primary="Delete" description="All of yuour posts, likes and comments will be permanently deleted. Are you sure you want to proceed" title="Delete profile" isOpen={dialogIsOpen} onClose={dialogOnClose} isLoading={deleteProfileLoading} action={deleteProfile} /> 
      <Stack spacing="10" direction={['column', 'column', 'row']}>
        <Box w={['full', 'full', 'lg']}>
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
            <SimpleGrid mt="4" columns={3} gap="3" >
              <Link href="/posts/create" passHref>
                <Button variant="outline" as="a" colorScheme={COLOR_SCHEME} leftIcon={<Icon as={PlusIcon} w="4" h="4" />}>
                  Post        
                </Button>
              </Link>       
              <Button variant="outline" colorScheme={COLOR_SCHEME} onClick={onOpen} leftIcon={<Icon as={PencilAltIcon} w="4" h="4" />}>
                Edit
              </Button>
              <Button variant="outline" colorScheme="red" onClick={dialogOnOpen} leftIcon={<Icon as={TrashIcon} w="4" h="4" />}>
                Delete
              </Button>
            </SimpleGrid>}
        </Box>
        <Flex flex="1" justify="center">
          {data.user.posts.length === 0 ? 
            <Flex direction="column" align="center">
              <Icon as={InboxIcon} w="40" h="40" />
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

  const res = await apolloClient.query<UserQuery, UserQueryVariables>({
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
    notFound: !res.data.user
  };
};


export default UserProfile;