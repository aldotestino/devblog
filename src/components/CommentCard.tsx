import { Box, Text, Flex, Avatar, Link as CLink } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { PostQuery_post_comments } from '../__generated__/PostQuery';

interface CommentCardProps {
  comment: PostQuery_post_comments
}

function CommentCard({ comment }: CommentCardProps) {
  return  (
    <Box border="1px" borderColor="inherit" rounded="lg" p="4" shadow="sm">
      <Flex align="center">
        <Avatar mr="4" src={comment.user.avatar} name={comment.user.username} size="md" />
        <Box>
          <Text fontSize="lg">
            <Link href={`/@${comment.user.username}`}>
              <CLink color="blue.400">            
                {`@${comment.user.username}`}
              </CLink>
            </Link>
            <br/>
            {new Date(comment.createdAt).toLocaleDateString()}
          </Text>
        </Box>
      </Flex>
      <Text mt="4" fontSize="lg">
        {comment.content}
      </Text>
    </Box>
  );
}

export default CommentCard;