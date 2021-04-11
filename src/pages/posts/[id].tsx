import { gql, useMutation, useQuery } from '@apollo/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useMemo, useState } from 'react';
import { DeleteIcon, EditIcon, LinkIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Heading, Text, Link as CLink, Stack, useToast, useBreakpointValue, Menu, MenuButton, MenuList, MenuItem, IconButton, Icon, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { initializeApollo } from '../../utils/apolloConfig';
import { PostQuery, PostQueryVariables } from '../../__generated__/PostQuery';
import Link from 'next/link';
import CommentBox from '../../components/CommentsBox';
import { HeartIcon as FullHeart, DotsVerticalIcon } from '@heroicons/react/solid';
import { HeartIcon as OutlineHeart } from '@heroicons/react/outline';
import { useAuth } from '../../store/User';
import { LikeMutation, LikeMutationVariables } from '../../__generated__/LikeMutation';
import LikesBox from '../../components/LikesBox';
import Head from 'next/head';
import { DeletePostMutation, DeletePostMutationVariables } from '../../__generated__/DeletePostMutation';
import { useRouter } from 'next/router';
import EditPostModal from '../../components/EditPostModal';
import { EditPostMutation, EditPostMutationVariables } from '../../__generated__/EditPostMutation';
import Markdown from '../../components/Markdown';
import { COLOR_SCHEME } from '../../styles/theme';
import prisma from '../../lib/prisma';

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

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const LIKE_MUTATION = gql`
  mutation LikeMutation($postId: ID!) {
    like(postId: $postId)
  }
`;

const EDIT_POST_MUTATION = gql`
  mutation EditPostMutation($postId: ID!, $title: String!, $description: String!, $content: String!) {
    editPost(postId: $postId, title: $title, description: $description, content: $content) {
      title,
      description,
      content
    }
  }
`;

interface PostProps {
  id: string
}

function Post({ id }: PostProps) {

  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();
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

  const router = useRouter();

  const [deletePost] = useMutation<DeletePostMutation, DeletePostMutationVariables>(DELETE_POST_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    variables: {
      postId: post.id
    },
    onCompleted: ({ deletePost }) => {
      if(deletePost) {
        router.push(`/@${user.username}`);
      }
    }
  });
  
  const isMe = useMemo(() => isAuth && user.id === post.user.id, [post, user]);
  const isMobile = useBreakpointValue({ base: true, md: false });
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

  const [editPost, { loading }] = useMutation<EditPostMutation, EditPostMutationVariables>(EDIT_POST_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    onCompleted: ({ editPost }) => {
      if(editPost) {
        onClose();
        refetch();
      }
    },
    onError: (e) => {
      console.log(e);
    }
  });

  const initalValues = {
    title: post.title,
    description: post.description,
    content: post.content
  };

  function action(variables: Partial<EditPostMutationVariables>) {
    editPost({
      variables: {
        postId: post.id,
        title: variables.title!,
        description: variables.description!,
        content: variables.content!
      }
    });
  }

  return (
    <>
      <Head>
        <title>devBlog - @{post.user.username}/{post.title}</title>
      </Head>

      <EditPostModal isOpen={isOpen} isLoading={loading} onClose={onClose} initialValues={initalValues} action={action} />

      <Stack spacing={['4', '4', '10']} direction={['column', 'column', 'row']}>
        <Box w={['full', 'full', 'lg']}>
          <Heading fontStyle="italic">{post.title}</Heading>
          <Text fontSize="2xl">{post.description}</Text>
          <Flex mt="4" align="flex-start" justify="space-between">
            <Flex align="center">
              <Avatar mr="4" src={post.user.avatar} name={post.user.username} size="lg" />
              <Box>
                <Text fontSize="xl">
                  By{' '}
                  <Link href={`/@${post.user.username}`} passHref>
                    <CLink color={`${COLOR_SCHEME}.400`}>
                      {`@${post.user.username}`}
                    </CLink>
                  </Link> 
                </Text>
                <Text>Posted on {new Date(post.createdAt).toLocaleDateString()}</Text>
              </Box>
            </Flex>
            <Menu>
              <MenuButton as={IconButton} rounded="full" variant="ghost" icon={<Icon w={6} h={6} as={DotsVerticalIcon} />} />
              <MenuList>
                {isMe && <MenuItem 
                  icon={<DeleteIcon />}
                  onClick={() => deletePost()}
                >
                    Delete
                </MenuItem>}
                {isMe && <MenuItem icon={<EditIcon />} onClick={onOpen}>Edit</MenuItem>}
                <MenuItem 
                  icon={<LinkIcon />} 
                  onClick={() => {
                    navigator.clipboard.writeText(String(window.location));
                  }}>
                  Share
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          {/* LIKES AND COMMENTS FOR DESKTOP */}
          {!isMobile && <Box display={['none', 'none', 'block']}>
            <Flex mt="4" align="center">
              <LikeButton style={{ width: '40px', height: '40px', color: isLiked ? '#F56565' : '#A0AEC0', cursor: 'pointer' }} onClick={handleLike} />
              <LikesBox borderColor={useColorModeValue('gray.50', 'gray.800')} ml="2" likes={post.likes} />
            </Flex>
            <CommentBox comments={post.comments} postId={post.id} />
          </Box>}
        </Box>
        <Box flex="1" h="fit-content" border="1px" bg="white" borderColor="inherit" shadow="md" p="4" rounded="lg">
          <Markdown content={post.content} />
        </Box>
        {/* LIKES AND COMMENTS FOR MOBILE */}
        {isMobile && <Box display={['block', 'block', 'none']}>
          <Flex mt="4" align="center">
            <LikeButton style={{ width: '40px', height: '40px', color: isLiked ? '#F56565' : '#A0AEC0', cursor: 'pointer' }} onClick={handleLike} />
            <LikesBox borderColor={useColorModeValue('gray.50', 'gray.800')} ml="2" likes={post.likes} />
          </Flex>
          <CommentBox comments={post.comments} postId={post.id} />
        </Box>}
      </Stack>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true
    }
  });

  return {
    paths: posts.map(p => ({ params: { id: p.id } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<unknown, {id: string}> = async (context) => {
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