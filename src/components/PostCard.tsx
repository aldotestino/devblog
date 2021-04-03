import { Avatar, AvatarGroup, Box, Flex, Heading, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import React from 'react';
import { UserQuery_user_posts, UserQuery_user_posts_likes } from '../__generated__/UserQuery';

interface PostCardProps {
  post: UserQuery_user_posts
}

function getFormattedLikes(likes: UserQuery_user_posts_likes[]): string {
  if(likes.length === 0) return '';
  const formattedLikes = 'liked by ';
  if(likes[0]) {
    formattedLikes.concat(likes[0].user.username);
  }
  if(likes[1]) {
    formattedLikes.concat(`, ${likes[1].user.username}`);
    if(likes.length > 2) {
      formattedLikes.concat(`and ${likes.length - 2} others`);
    }
  }
  return formattedLikes;
}

function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Box cursor="pointer" border="1px" borderColor="blue.300" rounded="lg" p="4" shadow="sm">
        <Flex align="center">
          <Heading size="lg">{post.title}</Heading>
          <ArrowForwardIcon color="blue.300" ml="4" w="6" h="6" />
        </Flex>
        <Text mt="2" fontSize="xl">{post.description}</Text>
        {post.likes.length > 0 && <Flex>
          <AvatarGroup mt="2" size="xs" max={2}>
            {post.likes.map(l => {
              <Avatar name={l.user.username} src={l.user.avatar} />;
            })}
          </AvatarGroup>
          <Text alignSelf="flex-end" ml="1">{getFormattedLikes(post.likes)}</Text>
        </Flex>}
      </Box>
    </Link>
  );
}

export default PostCard;