import { User } from '@prisma/client';
import { ResolverFunc } from '../../utils/types';
import prisma from '../../lib/prisma';

const posts: ResolverFunc<User, unknown> = ({ id }) => {
  return prisma.user.findUnique({
    where: {
      id
    }
  }).posts({
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const comments: ResolverFunc<User, unknown> = ({ id } ) => {
  return prisma.user.findUnique({
    where: {
      id
    }
  }).comments();
};

const likes: ResolverFunc<User, unknown> = ({ id } ) => {
  return prisma.user.findUnique({
    where: {
      id
    }
  }).likes();
};

export {
  posts,
  comments,
  likes
};