import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ResolverFunc } from '../../utils/types';
import { LoginMutationVariables } from '../../__generated__/LoginMutation';
import { SignupMutationVariables } from '../../__generated__/SignupMutation';
import prisma from '../../lib/prisma';
import { PostMutationVariables } from '../../__generated__/PostMutation';
import { CommentMutationVariables } from '../../__generated__/CommentMutation';
import { LikeMutationVariables } from '../../__generated__/LikeMutation';
import { DeletePostMutationVariables } from '../../__generated__/DeletePostMutation';
import { DeleteCommentMutationVariables } from '../../__generated__/DeleteCommentMutation';
import { EditPostMutationVariables } from '../../__generated__/EditPostMutation';
import { EditProfileMutationVariables } from '../../__generated__/EditProfileMutation';

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

const login: ResolverFunc<unknown, LoginMutationVariables> = async (_, { password, username }, { userId, res }) => {

  if(userId) {
    throw new Error('Already logged in');
  }

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

  const token = jwt.sign(user.id, process.env.JWT_SECRET);

  // set cookie
  res.cookie('access-token', token, {});
  
  return user;
};

const logout: ResolverFunc<unknown, unknown> = async (_, __, { userId, res }) => {
  if(!userId) {
    return false;
  }

  // delete cookie
  res.cookie('access-token', '', {});
  return true;
};

const editProfile: ResolverFunc<unknown, EditProfileMutationVariables> = (_, args, { userId }) => {
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
    DELETE FROM "Post" WHERE id=${postId};
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

const deleteProfile: ResolverFunc<unknown, unknown> = async (_, __, { userId }) => {
  
  await prisma.$executeRaw`
    DELETE FROM "User" WHERE id=${userId};
  `;

  return true;
};

export {
  signup,
  login,
  logout,
  editProfile,
  post,
  comment,
  like,
  deletePost,
  deleteComment,
  editPost,
  deleteProfile
};