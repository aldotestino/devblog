import { Avatar, AvatarGroup, Box, Flex, Heading, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import React from 'react';
import { UserQuery_user_posts } from '../__generated__/UserQuery';
import LikesBox from './LikesBox';

interface PostCardProps {
  post: UserQuery_user_posts
}

function PostCard({ post }: PostCardProps) {
  return (
    <LinkBox cursor="pointer" border="1px" transition="all .2s ease" _hover={{ transform: 'scale(1.01)', borderColor: 'blue.300' }} borderColor="gray.300" rounded="lg" p="4" shadow="sm">
      <Flex align="center">
        <Heading size="lg">
          <Link href={`/posts/${post.id}`} passHref>
            <LinkOverlay>
              {post.title}
            </LinkOverlay>
          </Link>
        </Heading>
        <ArrowForwardIcon color="blue.300" ml="4" w="6" h="6" />
      </Flex>
      <Text mt="2" fontSize="xl">{post.description}</Text>
      <Text>Posted on {new Date(post.createdAt).toLocaleDateString()}</Text>
      <LikesBox likes={post.likes} />
    </LinkBox>
  );
}

export default PostCard;