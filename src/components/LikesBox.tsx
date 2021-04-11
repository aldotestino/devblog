import { Avatar, AvatarGroup, Flex, FlexProps, Text } from '@chakra-ui/react';
import React from 'react';
import { UserQuery_user_posts_likes } from '../__generated__/UserQuery';

function getFormattedLikes(likes: UserQuery_user_posts_likes[]): string {
  if(likes.length === 0) return '';
  let formattedLikes = 'liked by ';
  if(likes[0]) {
    formattedLikes += likes[0].user.username;
  }
  if(likes[1]) {
    formattedLikes += `, ${likes[1].user.username}`;
    if(likes.length > 2) {
      formattedLikes += ` and ${likes.length - 2} others`;
    }
  }
  return formattedLikes;
}

interface LikesBoxProps extends FlexProps {
  likes: UserQuery_user_posts_likes[],
  borderColor: string
}

function LikesBox({ likes, borderColor, ...props }: LikesBoxProps) {
  if(likes.length === 0) return null;
  return (
    <Flex {...props} mt="2" align="center">
      <AvatarGroup size="sm" max={2} borderColor={borderColor}>
        {likes.map((like, i) => <Avatar key={i} src={like.user.avatar} transition="border-color .2s ease" name={like.user.username} />)}
      </AvatarGroup>
      <Text ml="1">{getFormattedLikes(likes)}</Text>
    </Flex>);
}

export default LikesBox;