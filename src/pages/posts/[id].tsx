import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import React, { useMemo } from 'react';
import { Avatar, Box, Flex, Heading, Text, Link as CLink, Stack, useToast, useBreakpointValue, Menu, MenuButton, MenuList, MenuItem, IconButton, Icon, useDisclosure, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { initializeApollo } from '../../utils/apolloConfig';
import { PostQuery, PostQueryVariables, PostQuery_post_likes } from '../../__generated__/PostQuery';
import Link from 'next/link';
import CommentBox from '../../components/CommentsBox';
import { HeartIcon as FullHeart, DotsVerticalIcon } from '@heroicons/react/solid';
import { HeartIcon as OutlineHeart, PencilAltIcon, TrashIcon, ShareIcon } from '@heroicons/react/outline';
import { useAuth } from '../../store/Auth';
import { LikeMutation, LikeMutationVariables } from '../../__generated__/LikeMutation';
import LikesBox from '../../components/LikesBox';
import { DeletePostMutation, DeletePostMutationVariables } from '../../__generated__/DeletePostMutation';
import { useRouter } from 'next/router';
import EditPostModal from '../../components/EditPostModal';
import { EditPostMutation, EditPostMutationVariables } from '../../__generated__/EditPostMutation';
import Markdown from '../../components/Markdown';
import { COLOR_SCHEME } from '../../styles/theme';
import SEO from '../../components/SEO';

export const POST_QUERY = gql` 
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
  const { data: { post } } = useQuery<PostQuery, PostQueryVariables>(POST_QUERY, {
    variables: {
      id
    }
  });
  const { isAuth, user } = useAuth(); 
  const isLiked =  post.likes.some(l => l.user.id === user?.id);
  const [like] = useMutation<LikeMutation, LikeMutationVariables>(LIKE_MUTATION, {
    update: (cache, { data: { like } }) => {
      // if you have unliked remove the like
      if(!like) {
        cache.writeQuery<PostQuery, PostQueryVariables>({
          query: POST_QUERY,
          variables: {
            id
          },
          data: {
            post: {
              ...post,
              likes: post.likes.filter(l => l.user.id !== user.id)
            }  
          }
        });

        return;
      }

      // otherwise update the cache adding your like
      const newLike: PostQuery_post_likes = {
        __typename: 'Like',
        user: {
          __typename: 'User',
          id: user.id,
          username: user.username,
          avatar: user.avatar
        }
      };

      cache.writeQuery<PostQuery, PostQueryVariables>({
        query: POST_QUERY,
        variables: {
          id
        },
        data: {
          post: {
            ...post,
            likes: [...post.likes, newLike]
          }  
        }
      });
    }
  });

  const router = useRouter();

  const [deletePost] = useMutation<DeletePostMutation, DeletePostMutationVariables>(DELETE_POST_MUTATION, {
    variables: {
      postId: post.id
    },
    onCompleted: ({ deletePost }) => {
      if(deletePost) {
        toast({
          title: 'Delete post',
          description: 'Post deleted succesfully',
          status: 'info',
          duration: 3000,
          position: 'top-right',
          isClosable: true
        });
        router.push(`/@${user.username}`);
      }
    }
  });
  
  const isMe = useMemo(() => isAuth && user.id === post.user.id, [post, user]);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const LikeButton = isLiked ? FullHeart : OutlineHeart;

  function handleLike() {
    like({
      variables: {
        postId: id
      }
    });
  }

  const [editPost, { loading }] = useMutation<EditPostMutation, EditPostMutationVariables>(EDIT_POST_MUTATION, {
    onCompleted: () => {
      onClose();
    },
    update: (cache, { data: { editPost } }) => {
      cache.writeQuery<PostQuery, PostQueryVariables>({
        query: POST_QUERY,
        variables: {
          id
        },
        data: {
          post: {
            ...post,
            title: editPost.title,
            description: editPost.description,
            content: editPost.content
          }
        }
      });
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
      <SEO title={`devBlog - @${post.user.username}/${post.title}`} description={post.description} /> 

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
                {isMe && <MenuItem icon={<Icon as={TrashIcon} h="4" w="4" />} onClick={() => deletePost()}>
                    Delete
                </MenuItem>}
                {isMe && <MenuItem icon={<Icon as={PencilAltIcon} h="4" w="4" />} onClick={onOpen}>
                  Edit
                </MenuItem>}
                <MenuItem 
                  icon={<Icon as={ShareIcon} h="4" w="4" />} 
                  onClick={() => {
                    navigator.clipboard.writeText(String(window.location));
                    toast({
                      title: 'Share this post',
                      description: 'Link copied to your clipboard',
                      status: 'info',
                      duration: 3000,
                      position: 'top-right',
                      isClosable: true
                    });
                  }}>
                  Share
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          {/* LIKES AND COMMENTS FOR DESKTOP */}
          {!isMobile && <Box display={['none', 'none', 'block']}>
            <Flex mt="4" align="center">
              <Tooltip hasArrow label={isLiked ? 'Dislike this post' : 'Like this post'}>
                <IconButton disabled={!isAuth} aria-label="like" variant="unstyled" icon={<Icon as={LikeButton} w="10" h="10" color={isLiked ? 'red.400' : 'gray.400'} />} onClick={handleLike} />
              </Tooltip>
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
            <Tooltip hasArrow label={isLiked ? 'Dislike this post' : 'Like this post'}>
              <IconButton disabled={!isAuth} aria-label="like" variant="unstyled" icon={<Icon as={LikeButton} w="10" h="10" color={isLiked ? 'red.400' : 'gray.400'} />} onClick={handleLike} />
            </Tooltip>
            <LikesBox borderColor={useColorModeValue('gray.50', 'gray.800')} ml="2" likes={post.likes} />
          </Flex>
          <CommentBox comments={post.comments} postId={post.id} />
        </Box>}
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<unknown, {id: string}> = async (context) => {
  const apolloClient = initializeApollo();

  const id = context.params.id;

  const res = await apolloClient.query<PostQuery, PostQueryVariables>({
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
    notFound: !res.data.post
  };
};

export default Post;