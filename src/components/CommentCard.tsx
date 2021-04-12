import { DeleteIcon, Icon } from '@chakra-ui/icons';
import { Box, Text, Flex, Avatar, Link as CLink, useColorModeValue, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { useAuth } from '../store/User';
import { PostQuery_post_comments } from '../__generated__/PostQuery';
import { gql, useMutation } from '@apollo/client';
import { DeleteCommentMutation, DeleteCommentMutationVariables } from '../__generated__/DeleteCommentMutation';
import { COLOR_SCHEME } from '../styles/theme';

const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteCommentMutation($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

interface CommentCardProps {
  comment: PostQuery_post_comments,
  removeFromUI: (commentId: string) => void
}

function CommentCard({ comment, removeFromUI }: CommentCardProps) {

  const { isAuth, user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.700');
  const isMe = useMemo(() => isAuth && user.id === comment.user.id, [comment, user]);
  const [deleteComment] = useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DELETE_COMMENT_MUTATION, {
    context: {
      headers: {
        authorization: user?.token
      }
    },
    variables: {
      commentId: comment.id
    },
    onCompleted: ({ deleteComment }) => {
      if(deleteComment) {
        removeFromUI(comment.id);
      }
    }
  });

  return  (
    <Box border="1px" borderColor="inherit" rounded="lg" transition="background-color .2s ease" p="4" bg={bgColor} shadow="md">
      <Flex align="flex-start" justify="space-between">
        <Flex align="center">
          <Avatar mr="4" src={comment.user.avatar} name={comment.user.username} size="md" />
          <Box>
            <Text fontSize="md">
              <Link href={`/@${comment.user.username}`} passHref>
                <CLink fontSize="lg" color={`${COLOR_SCHEME}.400`}>            
                  {`@${comment.user.username}`}
                </CLink>
              </Link>
              <br/>
              {new Date(comment.createdAt).toLocaleDateString()}
            </Text>
          </Box>
        </Flex>
        {isMe && <Menu>
          <MenuButton as={IconButton} rounded="full" variant="ghost" icon={<Icon w={6} h={6} as={DotsVerticalIcon} />} />
          <MenuList>
            <MenuItem
              icon={<DeleteIcon />}
              onClick={() => deleteComment()}
            >
                    Delete
            </MenuItem>
          </MenuList>
        </Menu>}
      </Flex>
      <Text mt="4" fontSize="lg">
        {comment.content}
      </Text>
    </Box>
  );
}

export default CommentCard;