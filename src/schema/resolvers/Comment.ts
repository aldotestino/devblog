import { Comment } from '@prisma/client';
import { ResolverFunc } from '../../utils/types';
import prisma from '../../lib/prisma';

const post: ResolverFunc<Comment, unknown> = ({ id }) => {
  return prisma.comment.findUnique({
    where: {
      id
    }
  }).post();
};

const user: ResolverFunc<Comment, unknown> = ({ id }) => {
  return prisma.comment.findUnique({
    where: {
      id
    }
  }).user();
};

const createdAt: ResolverFunc<Comment, unknown> = ({ createdAt }) => {
  return createdAt.toISOString();
};

export {
  post,
  user,
  createdAt
};