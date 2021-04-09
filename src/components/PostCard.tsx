import { Avatar, Flex, Heading, LinkBox, LinkOverlay, Stack, Text, Link as CLink, Box, useColorModeValue } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import React from 'react';
import { UserQuery_user_posts } from '../__generated__/UserQuery';
import LikesBox from './LikesBox';
import { FeedQuery_feed, FeedQuery_feed_user } from '../__generated__/FeedQuery';
import { COLOR_SCHEME } from '../styles/theme';

interface PostCardProps {
  post: UserQuery_user_posts | FeedQuery_feed
  user?: FeedQuery_feed_user
}

function PostCard({ post, user }: PostCardProps) {

  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <LinkBox cursor="pointer" border="1px" h="fit-content" transition="all .2s ease" _hover={{ transform: 'scale(1.01)', borderColor: `${COLOR_SCHEME}.400` }} bgColor={bgColor} borderColor="inherit" rounded="lg" p="4" shadow="md">
      <Flex align="center">
        <Heading size="lg">
          <Link href={`/posts/${post.id}`} passHref>
            <LinkOverlay>
              {post.title}
            </LinkOverlay>
          </Link>
        </Heading>
        <ArrowForwardIcon color={`${COLOR_SCHEME}.400`} ml="4" w="6" h="6" />
      </Flex>
      <Text mt="2" fontSize="xl">{post.description}</Text>
      {user && 
        <Stack spacing="2" mt="2" direction="row" align="center">
          <Avatar src={user.avatar} size="md" name={user.username} />
          <Box>
            <Text fontSize="xl">
              By{' '}
              <Link href={`/@${user.username}`} passHref>
                <CLink color={`${COLOR_SCHEME}.400`}>
                  {`@${user.username}`}
                </CLink>
              </Link>
            </Text>
            <Text fontSize="base">Posted on {new Date(post.createdAt).toLocaleDateString()}</Text>
          </Box>
        </Stack>}
      {!user && <Text>Posted on {new Date(post.createdAt).toLocaleDateString()}</Text>}
      <LikesBox likes={post.likes} />
    </LinkBox>
  );
}

export default PostCard;