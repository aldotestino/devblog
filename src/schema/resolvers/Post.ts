import { Post } from '@prisma/client';
import { ResolverFunc } from '../../utils/types';
import prisma from '../../lib/prisma';


const user: ResolverFunc<Post, unknown> = ({ id }) => {
  return prisma.post.findUnique({
    where: {
      id
    }
  }).user();
};

const comments: ResolverFunc<Post, unknown> = ({ id } ) => {
  return prisma.post.findUnique({
    where: {
      id
    }
  }).comments({
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const likes: ResolverFunc<Post, unknown> = ({ id } ) => {
  return prisma.post.findUnique({
    where: {
      id
    }
  }).likes();
};

const createdAt: ResolverFunc<Post, unknown> = ({ createdAt }) => {
  return createdAt.toISOString();
};

export {
  user,
  comments,
  likes,
  createdAt
};