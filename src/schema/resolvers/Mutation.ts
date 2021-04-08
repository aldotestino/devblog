import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/authHelpers';
import { ResolverFunc } from '../../utils/types';
import { LoginMutationVariables } from '../../__generated__/LoginMutation';
import { SignupMutationVariables } from '../../__generated__/SignupMutation';
import prisma from '../../lib/prisma';
import { PostMutationVariables } from '../../__generated__/PostMutation';
import { CommentMutationVariables } from '../../__generated__/CommentMutation';
import { LikeMutationVariables } from '../../__generated__/LikeMutation';
import { UpdateProfileMutationVariables } from '../../__generated__/UpdateProfileMutation';
import { DeletePostMutationVariables } from '../../__generated__/DeletePostMutation';
import { DeleteCommentMutationVariables } from '../../__generated__/DeleteCommentMutation';
import { EditPostMutationVariables } from '../../__generated__/EditPostMutation';

const signup: ResolverFunc<unknown, SignupMutationVariables> = async (_, { password, ...rest }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword
    }
  });

  return true;
};

const login: ResolverFunc<unknown, LoginMutationVariables> = async (_, { password, username }) => {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if(!user) {
    throw new Error('User doesn\'t exist');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if(!passwordMatch) {
    throw new Error('Wrong password');
  }

  const token = jwt.sign(user.id, JWT_SECRET);
  
  return {
    token,
    user
  };

};

const editProfile: ResolverFunc<unknown, UpdateProfileMutationVariables> = (_, args, { userId }) => {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: args
  });
};

const post: ResolverFunc<unknown, PostMutationVariables> = (_, args, { userId }) => {
  return prisma.post.create({
    data: {
      ...args,
      userId
    }
  });
};

const comment: ResolverFunc<unknown, CommentMutationVariables> = (_, args, { userId }) => {
  return prisma.comment.create({
    data: {
      ...args,
      userId
    }
  });
};

const like: ResolverFunc<unknown, LikeMutationVariables> = async (_, { postId }, { userId }) => {
  const alreadyLiked = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  });

  if(alreadyLiked) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });
    return false;
  }

  await prisma.like.create({
    data: {
      userId,
      postId
    }
  });
  return true;
};

const deletePost: ResolverFunc<unknown, DeletePostMutationVariables> = async (_, { postId }, { userId }) => {
  const postToDelete = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });

  if(postToDelete.userId !== userId) {
    throw new Error('Cannot delete post');
  }

  // Executing a raw sql command
  // prisma cannot delete on cascade for now
  await prisma.$executeRaw`
    DELETE FROM Post WHERE id=${postId};
  `;

  return true;
};

const deleteComment: ResolverFunc<unknown, DeleteCommentMutationVariables> = async (_, { commentId }, { userId }) => {
  const commentToDelete = await prisma.comment.findUnique({
    where: {
      id: commentId
    }
  });

  if(commentToDelete.userId !== userId) {
    throw new Error('Cannot delete comment');
  }

  await prisma.comment.delete({
    where: {
      id: commentId
    }
  });

  return true;
};

const editPost: ResolverFunc<unknown, EditPostMutationVariables> = async (_, { postId, ...args }, { userId }) => {
  const postToEdit = await prisma.post.findUnique({
    where: {
      id: postId
    }
  });

  if(postToEdit.userId !== userId) {
    throw new Error('Cannot edit post');
  }

  return prisma.post.update({
    where: {
      id: postId
    },
    data: args
  });
};

export {
  signup,
  login,
  editProfile,
  post,
  comment,
  like,
  deletePost,
  deleteComment,
  editPost
};